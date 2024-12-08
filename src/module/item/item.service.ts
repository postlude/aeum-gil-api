import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ItemRepository } from 'src/database/repository/item.repository';
import { FetchItemDto } from './item.dto';

@Injectable()
export class ItemService {
	constructor(
		private readonly itemRepository: ItemRepository
	) {}

	public async getAllItems() {
		const items = await this.itemRepository.findBy({});
		return plainToInstance(FetchItemDto, items, { excludeExtraneousValues: true });
	}
}
