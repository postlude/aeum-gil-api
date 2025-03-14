import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChoiceOption } from 'src/database/entity/choice-option.entity';
import { ChoiceOptionItemMappingRepository } from 'src/database/repository/choice-option-item-mapping.repository';
import { ItemRepository } from 'src/database/repository/item.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { In } from 'typeorm';
import { GameItem, GamePage } from './game.dto';
import { PlayRecordRepository } from 'src/database/repository/play-record.repository';
import { EndingRepository } from 'src/database/repository/ending.repository';
import { EndingRecordRepository } from 'src/database/repository/ending-record.repository';
import { EndingInfo } from '../ending/ending.model';
import { isExists } from 'src/util/validator';

@Injectable()
export class GameService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly itemRepository: ItemRepository,
		private readonly choiceOptionItemMappingRepository: ChoiceOptionItemMappingRepository,
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

	public async saveEndingRecord(params: {
		userId: number,
		endingId: number
	}) {
		const { userId, endingId } = params;

		const ending = await this.endingRepository.findOneBy({ id: endingId });
		if (!ending) {
			throw new NotFoundException('존재하지 않는 엔딩입니다.');
		}

		await this.endingRecordRepository.insert({ userId, endingId });

		return plainToInstance(EndingInfo, ending, { excludeExtraneousValues: true });
	}
}
