import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChoiceOption } from 'src/database/entity/choice-option.entity';
import { ChoiceOptionItemMappingRepository } from 'src/database/repository/choice-option-item-mapping.repository';
import { ItemRepository } from 'src/database/repository/item.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { In } from 'typeorm';
import { GameItem, GamePage } from './game.dto';

@Injectable()
export class GameService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly itemRepository: ItemRepository,
		private readonly choiceOptionItemMappingRepository: ChoiceOptionItemMappingRepository
	) {}

	public async getAllGameItems() {
		const items = await this.itemRepository.find({
			select: [ 'id', 'name', 'description', 'image' ]
		});

		return plainToInstance(GameItem, items);
	}

	public async getGamePage(pageId: number) {
		const page = await this.pageRepository.findGamePage(pageId);
		if (!page?.choiceOptions?.length) {
			throw new NotFoundException('존재하지 않는 페이지입니다.');
		}

		const { id, choiceOptions, ...rest } = page;

		const itemMappings = await this.getItemMappings(choiceOptions);
		const gameChoiceOptions = choiceOptions.map(({ id, ...rest }) => {
			const items = itemMappings.filter(({ choiceOptionId }) => choiceOptionId === id);
			return {
				choiceOptionId: id,
				items: items.length ? items : undefined,
				...rest
			};
		});

		return plainToInstance(GamePage, {
			pageId: id,
			choiceOptions: gameChoiceOptions,
			...rest
		}, { excludeExtraneousValues: true });
	}

	private async getItemMappings(choiceOptions: ChoiceOption[]) {
		const choiceOptionIds = choiceOptions.map(({ id }) => id);
		return await this.choiceOptionItemMappingRepository.findBy({ choiceOptionId: In(choiceOptionIds) });
	}
}
