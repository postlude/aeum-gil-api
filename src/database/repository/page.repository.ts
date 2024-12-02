import { DataSource, Repository } from 'typeorm';
import { Page } from '../entity/page.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PageRepository extends Repository<Page> {
	constructor(private dataSource: DataSource) {
		super(Page, dataSource.createEntityManager());
	}

	public async findWithChoiceOptions(pageId: number) {
		return await this.createQueryBuilder('p')
			.comment('PageRepository.findWithChoiceOptions')
			.innerJoinAndSelect('p.choiceOptions', 'co')
			.where('p.id = :pageId', { pageId })
			.orderBy('co.orderNum', 'ASC')
			.getOne();
	}
}