import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ItemRepository } from 'src/database/repository/item.repository';
import { FetchItemDto, ItemDtoCommon, SaveItemDto } from './item.dto';

@Injectable()
export class ItemService {
	constructor(
		private readonly itemRepository: ItemRepository
	) {}

	public async getAllItems() {
		const items = await this.itemRepository.findBy({});
		return plainToInstance(FetchItemDto, items, { excludeExtraneousValues: true });
	}

	public async addItem(params: SaveItemDto) {
		const parsed = plainToInstance(ItemDtoCommon, params, { excludeExtraneousValues: true });

		const result = await this.itemRepository.insert(parsed);
		const itemId = result.identifiers[0].id as number;
		return itemId;
	}
}
