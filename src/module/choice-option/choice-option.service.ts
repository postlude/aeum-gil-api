import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChoiceOptionRepository } from 'src/database/repository/choice-option.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { In } from 'typeorm';
import { AddChoiceOptionBody, AddChoiceOptionItemBody, SetChoiceOptionBody } from './choice-option.dto';
import { ChoiceOptionItemMappingRepository } from 'src/database/repository/choice-option-item-mapping.repository';
import { ItemActionType, MoveTargetType } from 'src/database/entity';
import { ItemRepository } from 'src/database/repository/item.repository';
import { EndingRepository } from 'src/database/repository/ending.repository';

@Injectable()
export class ChoiceOptionService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly choiceOptionRepository: ChoiceOptionRepository,
		private readonly choiceOptionItemMappingRepository: ChoiceOptionItemMappingRepository,
		private readonly itemRepository: ItemRepository,
		private readonly endingRepository: EndingRepository
	) {}

	public async addChoiceOption(choiceOption: AddChoiceOptionBody) {
		const { pageId, moveTargetType, targetId, orderNum, content } = choiceOption;

		await this.checkPageEndingExists({
			type: 'insert',
			pageId,
			moveTargetType,
			targetId
		});

		const { identifiers } = await this.choiceOptionRepository.insert({ pageId, moveTargetType, targetId, orderNum, content });
		return identifiers[0].id as number;
	}

	public async setChoiceOption(setInfo: SetChoiceOptionBody, choiceOptionId: number) {
		const { moveTargetType, targetId, orderNum, content } = setInfo;

		const choiceOption = await this.choiceOptionRepository.findOneBy({ id: choiceOptionId });
		if (!choiceOption) {
			throw new NotFoundException('선택지가 없습니다.');
		}

		await this.checkPageEndingExists({
			type: 'update',
			pageId: choiceOption.pageId,
			moveTargetType,
			targetId
		});

		await this.choiceOptionRepository.update({ id: choiceOptionId }, { moveTargetType, targetId, orderNum, content });
		return choiceOptionId;
	}

	private async checkPageEndingExists(params: {
		type: 'insert' | 'update'
		pageId: number
		moveTargetType?: MoveTargetType | null
		targetId?: number | null
	}) {
		const { type, pageId, moveTargetType, targetId } = params;

		const pageIds: number[] = type === 'insert' ? [ pageId ] : [];
		let endingId: number | undefined = undefined;

		if (targetId) {
			if (moveTargetType === MoveTargetType.Page) {
				if (targetId === pageId) {
					throw new BadRequestException('현재 페이지를 다음 페이지로 지정할 수 없습니다.');
				}
				pageIds.push(targetId);
			} else if (moveTargetType === MoveTargetType.Ending) {
				endingId = targetId;
			}
		}

		const [ pageCount, endingCount ] = await Promise.all([
			pageIds.length ? this.pageRepository.countBy({ id: In(pageIds) }) : null,
			endingId ? this.endingRepository.countBy({ id: endingId }) : null
		]);

		if (pageIds.length && pageIds.length !== pageCount) {
			throw new NotFoundException('페이지가 존재하지 않습니다.');
		}

		if (endingId && endingCount !== 1) {
			throw new NotFoundException('엔딩이 존재하지 않습니다.');
		}
	}

	public async removeChoiceOption(choiceOptionId: number) {
		await this.choiceOptionRepository.delete({ id: choiceOptionId });
	}

	public async reorderChoiceOptions(choiceOptionIds: number[]) {
		const promises = choiceOptionIds.map(async (id, index) => {
			const orderNum = index + 1;
			await this.choiceOptionRepository.update({ id }, { orderNum });

			return { choiceOptionId: id, orderNum };
		});

		return await Promise.all(promises);
	}

	public async addChoiceOptionItem(choiceOptionId: number, { itemId, actionType }: AddChoiceOptionItemBody) {
		await this.checkChoiceOptionItemExists(choiceOptionId, itemId);
		await this.choiceOptionItemMappingRepository.insert({ choiceOptionId, itemId, actionType });
		return itemId;
	}

	public async setChoiceOptionItem(choiceOptionId: number, itemId: number, actionType: ItemActionType) {
		await this.checkChoiceOptionItemExists(choiceOptionId, itemId);
		await this.choiceOptionItemMappingRepository.update({ choiceOptionId, itemId }, { actionType });
	}

	private async checkChoiceOptionItemExists(choiceOptionId: number, itemId: number) {
		const [ choiceOptionCount, itemCount ] = await Promise.all([
			this.choiceOptionRepository.countBy({ id: choiceOptionId }),
			this.itemRepository.countBy({ id: itemId })
		]);

		if (!choiceOptionCount || !itemCount) {
			throw new NotFoundException();
		}
	}

	public async removeChoiceOptionItem(choiceOptionId: number, itemId: number) {
		await this.choiceOptionItemMappingRepository.delete({ choiceOptionId, itemId });
	}
}
