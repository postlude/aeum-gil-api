import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Item } from '../entity/item.entity';

@Injectable()
export class ItemRepository extends Repository<Item> {
	constructor(private dataSource: DataSource) {
		super(Item, dataSource.createEntityManager());
	}
}