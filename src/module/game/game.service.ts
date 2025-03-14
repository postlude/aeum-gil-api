import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EndingRecordRepository } from 'src/database/repository/ending-record.repository';
import { EndingRepository } from 'src/database/repository/ending.repository';
import { ItemRepository } from 'src/database/repository/item.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { PlayRecordRepository } from 'src/database/repository/play-record.repository';
import { isExists } from 'src/util/validator';
import { GameEnding, GameItem, GamePage } from './game.dto';

@Injectable()
export class GameService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly itemRepository: ItemRepository,
		private readonly playRecordRepository: PlayRecordRepository,
		private readonly endingRepository: EndingRepository,
		private readonly endingRecordRepository: EndingRecordRepository
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
		choiceOptionId: number
	}) {
		const { userId, pageId, choiceOptionId } = params;

		const currentDetailLog = { choiceOptionId, createdAt: new Date() };

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
}
