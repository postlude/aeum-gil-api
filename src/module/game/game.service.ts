import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EndingRecordRepository, EndingRepository, ItemRepository, PageRepository, PlayRecordRepository, PlayStatusRepository } from 'src/database/repository';
import { isExists } from 'src/util/validator';
import { GameEnding, GameItem, GamePage, GameStatus } from './game.dto';
import { OwnedItem } from 'src/database/entity';

@Injectable()
export class GameService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly itemRepository: ItemRepository,
		private readonly playRecordRepository: PlayRecordRepository,
		private readonly endingRepository: EndingRepository,
		private readonly endingRecordRepository: EndingRecordRepository,
		private readonly playStatusRepository: PlayStatusRepository
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
		ownedItems: OwnedItem[]
	}) {
		const { userId, pageId, choiceOptionId, ownedItems } = params;

		const currentDetailLog = {
			choiceOptionId,
			createdAt: new Date(),
			ownedItems
		};

		const record = await this.playRecordRepository.findOneBy({ userId, pageId });

		if (record) {
			const { detailLog } = record;
			detailLog.push(currentDetailLog);
			await this.playRecordRepository.update({ userId, pageId }, { detailLog });
		} else {
			await this.playRecordRepository.insert({ userId, pageId, detailLog: [ currentDetailLog ] });
		}
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

		return plainToInstance(GameStatus, playStatus, { excludeExtraneousValues: true });
	}
}
