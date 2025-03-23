import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChoiceOptionItemMapping, ItemActionType, MoveTargetType, OwnedItem, PlayRecord } from 'src/database/entity';
import { ChoiceOptionRepository, EndingRecordRepository, EndingRepository, ItemRepository, PageRepository, PlayRecordRepository, PlayStatusRepository } from 'src/database/repository';
import { isExists } from 'src/util/validator';
import { Transactional } from 'typeorm-transactional';
import { GameEnding, GameItem, GamePage } from './game.dto';
import { PlayStatusInfo } from './game.model';

@Injectable()
export class GameService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly itemRepository: ItemRepository,
		private readonly playRecordRepository: PlayRecordRepository,
		private readonly endingRepository: EndingRepository,
		private readonly endingRecordRepository: EndingRecordRepository,
		private readonly playStatusRepository: PlayStatusRepository,
		private readonly choiceOptionRepository: ChoiceOptionRepository
	) {}

	public async getAllGameItems() {
		const items = await this.itemRepository.find({
			select: [ 'id', 'name', 'description', 'image' ]
		});

		return plainToInstance(GameItem, items);
	}

	public async getAllGamePages() {
		const pages = await this.pageRepository.findAllGamePages();

		return pages.map(({ id, choiceOptions, ...pageRest }) => {
			if (!choiceOptions) {
				return;
			}

			const parsed = choiceOptions.map(({ id, choiceOptionItemMappings, ...choiceOptionRest }) => {
				if (!choiceOptionItemMappings) {
					return;
				}

				return {
					choiceOptionId: id,
					items: choiceOptionItemMappings,
					...choiceOptionRest
				};
			}).filter(isExists);

			return plainToInstance(GamePage, {
				pageId: id,
				choiceOptions: parsed,
				...pageRest
			}, { excludeExtraneousValues: true });
		}).filter(isExists);
	}

	public async savePlayRecord(params: {
		userId: number,
		pageId: number,
		choiceOptionId: number,
	}) {
		const { userId, pageId, choiceOptionId } = params;

		const [ playRecord, playStatus, choiceOption ] = await Promise.all([
			this.playRecordRepository.findOneBy({ userId, pageId }),
			this.playStatusRepository.findOneBy({ userId }),
			this.choiceOptionRepository.findOneWithItemMappings(pageId, choiceOptionId)
		]);

		if (!playStatus) {
			throw new NotFoundException('플레이 상태가 존재하지 않습니다.');
		}
		if (!choiceOption?.moveTargetType || !choiceOption.targetId) {
			throw new NotFoundException('존재하지 않는 페이지 혹은 선택지입니다.');
		}

		const { moveTargetType, targetId, choiceOptionItemMappings } = choiceOption;
		const { ownedItems } = playStatus;
		const calculatedItems = this.calculateItems(ownedItems, choiceOptionItemMappings);

		await this.progressSavePlayRecord({
			userId,
			pageId,
			choiceOptionId,
			moveTargetType,
			targetId,
			ownedItems,
			calculatedItems,
			playRecord
		});

		return { moveTargetType, targetId, ownedItems: calculatedItems };
	}

	private calculateItems(ownedItems: OwnedItem[], itemMappings?: ChoiceOptionItemMapping[]) {
		if (!itemMappings?.length) {
			return ownedItems;
		}

		const ownedItemIds = ownedItems.map(({ itemId }) => itemId);
		const mappingItemIds = itemMappings.map(({ itemId }) => itemId);
		const itemSet = new Set([ ...ownedItemIds, ...mappingItemIds ]);
		const itemIds = Array.from(itemSet);

		return itemIds.map((itemId) => {
			const ownedItem = ownedItems.find((oi) => oi.itemId === itemId);
			const mappingItem = itemMappings.find((im) => im.itemId === itemId);

			if (ownedItem) {
				const { count } = ownedItem;

				// 소유 O, 매핑 O
				if (mappingItem) {
					const { actionType } = mappingItem;

					// TODO: 아이템 소모일 때 개수가 더 적으면 throw Error

					const calculatedCount = actionType === ItemActionType.Gain ? count + 1 : count - 1;

					// 전부 소모했으면 제거
					if (!calculatedCount) {
						return;
					}

					return { itemId, count: calculatedCount };
				}

				// 소유 O, 매핑 X
				return { itemId, count };
			}

			// 소유 X, 매핑 O
			if (mappingItem) {
				const { actionType } = mappingItem;

				if (actionType === ItemActionType.Loss) {
					throw new BadRequestException('아이템을 충분히 가지고 있지 않습니다.');
				}

				return { itemId, count: 1 };
			}
		}).filter(isExists);
	}

	@Transactional()
	private async progressSavePlayRecord(params: {
		userId: number,
		pageId: number,
		choiceOptionId: number,
		moveTargetType: MoveTargetType,
		targetId: number,
		ownedItems: OwnedItem[],
		calculatedItems: OwnedItem[],
		playRecord: PlayRecord | null,
	}) {
		const { userId, pageId, choiceOptionId, moveTargetType, targetId, ownedItems, calculatedItems, playRecord } = params;

		const currentDetailLog = {
			choiceOptionId,
			createdAt: new Date(),
			ownedItems
		};

		if (playRecord) {
			const { detailLog } = playRecord;
			detailLog.push(currentDetailLog);
			await this.playRecordRepository.update({ userId, pageId }, { detailLog });
		} else {
			await this.playRecordRepository.insert({ userId, pageId, detailLog: [ currentDetailLog ] });
		}

		await this.playStatusRepository.update({ userId }, {
			moveTargetType,
			targetId,
			ownedItems: calculatedItems
		});
	}

	public async getAllGameEndings(userId: number) {

		const [ endings, records ] = await Promise.all([
			this.endingRepository.find({ order: { orderNum: 'ASC' } }),
			this.endingRecordRepository.findBy({ userId })
		]);

		return endings.map(({ id, ...rest }) => {
			const isCleared = !!records.find(({ endingId }) => endingId === id);

			return plainToInstance(GameEnding, {
				...rest,
				isCleared
			}, { excludeExtraneousValues: true });
		});
	}

	public async saveEndingRecord(params: {
		userId: number,
		endingId: number
	}) {
		const { userId, endingId } = params;

		await this.endingRecordRepository.insertIgnore({ userId, endingId });
	}

	public async getPlayStatus(userId: number) {
		const playStatus = await this.playStatusRepository.findOneBy({ userId });
		if (!playStatus) {
			throw new NotFoundException('플레이 상태가 존재하지 않습니다.');
		}

		return plainToInstance(PlayStatusInfo, playStatus, { excludeExtraneousValues: true });
	}

	public async restorePlayStatus(userId: number, pageId: number) {
		const record = await this.playRecordRepository.findOneByPk(userId, pageId);
		if (!record) {
			throw new NotFoundException('플레이 기록이 없습니다.');
		}

		const sorted = record.detailLog.sort((prev, next) => prev.createdAt.getTime() - next.createdAt.getTime());
		const latestLog = sorted.pop();
		if (!latestLog) {
			throw new NotFoundException('상세 플레이 기록이 없습니다.');
		}

		const { ownedItems } = latestLog;

		await this.playStatusRepository.update({ userId }, {
			moveTargetType: MoveTargetType.Page,
			targetId: pageId,
			ownedItems
		});
	}
}
