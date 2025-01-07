import { Injectable, NotFoundException } from '@nestjs/common';
import { ChoiceOptionRepository } from 'src/database/repository/choice-option.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { In } from 'typeorm';
import { AddChoiceOptionBody, AddChoiceOptionItemBody, SetChoiceOptionBody } from './choice-option.dto';
import { ChoiceOptionItemMappingRepository } from 'src/database/repository/choice-option-item-mapping.repository';
import { ItemActionType } from 'src/database/entity/choice-option-item-mapping.entity';
import { ItemRepository } from 'src/database/repository/item.repository';

@Injectable()
export class ChoiceOptionService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly choiceOptionRepository: ChoiceOptionRepository,
		private readonly choiceOptionItemMappingRepository: ChoiceOptionItemMappingRepository,
		private readonly itemRepository: ItemRepository
	) {}

	public async addChoiceOption(choiceOption: AddChoiceOptionBody) {
		const { pageId, nextPageId, orderNum, content } = choiceOption;

		const pageIds = [ pageId ];
		if (nextPageId) {
			pageIds.push(nextPageId);
		}
		await this.checkPageExists(pageIds);

		const { identifiers } = await this.choiceOptionRepository.insert({ pageId, nextPageId, orderNum, content });
		return identifiers[0].id as number;;
	}

	public async setChoiceOption(choiceOption: SetChoiceOptionBody, choiceOptionId: number) {
		const { nextPageId, orderNum, content } = choiceOption;

		if (nextPageId) {
			await this.checkPageExists([ nextPageId ]);
		}

		await this.choiceOptionRepository.update({ id: choiceOptionId }, { nextPageId, orderNum, content });
		return choiceOptionId;
	}

	private async checkPageExists(pageIds: number[]) {
		const counts = await this.pageRepository.countBy({ id: In(pageIds) });
		if (pageIds.length !== counts) {
			throw new NotFoundException('페이지가 존재하지 않습니다.');
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
