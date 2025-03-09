import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ItemRepository } from 'src/database/repository/item.repository';
import { GameItem } from './game.dto';

@Injectable()
export class GameService {
	constructor(
		private readonly itemRepository: ItemRepository
	) {}

	public async getAllGameItems() {
		const items = await this.itemRepository.find({
			select: [ 'id', 'name', 'description', 'image' ]
		});

		return plainToInstance(GameItem, items);
	}
}
