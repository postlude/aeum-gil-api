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

	public async saveItem(dto: SaveItemDto, itemId?: number) {
		const parsed = plainToInstance(ItemDtoCommon, dto, { excludeExtraneousValues: true });

		const result = await this.itemRepository.save({
			...parsed,
			id: itemId
		});
		return result.id;
	}

	public async removeItem(itemId: number) {
		await this.itemRepository.delete({ id: itemId })
	}
}
