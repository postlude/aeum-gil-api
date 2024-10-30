import { DataSource, Repository } from 'typeorm';
import { Page } from '../entity/page.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PageRepository extends Repository<Page> {
	constructor(private dataSource: DataSource) {
		super(Page, dataSource.createEntityManager());
	}
}