import { DataSource, Repository } from 'typeorm';
import { Page } from '../entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PageRepository extends Repository<Page> {
	constructor(private dataSource: DataSource) {
		super(Page, dataSource.createEntityManager());
	}

	public async findOneWithChoiceOptions(pageId: number) {
		return await this.createQueryBuilder('p')
			.comment('PageRepository.findOneWithChoiceOptions')
			.leftJoinAndSelect('p.choiceOptions', 'co')
			.where('p.id = :pageId', { pageId })
			.orderBy('co.orderNum', 'ASC')
			.getOne();
	}

	public async findAllWithChoiceOptions() {
		return await this.createQueryBuilder('p')
			.comment('PageRepository.findAllWithChoiceOptions')
			.leftJoinAndSelect('p.choiceOptions', 'co')
			.orderBy('p.id', 'ASC')
			.addOrderBy('co.orderNum', 'ASC')
			.getMany();
	}

	public async findAllGamePages() {
		return await this.createQueryBuilder('p')
			.comment('PageRepository.findAllGamePages')
			.select([
				'c.title', 'c.image',
				'p.id', 'p.place', 'p.content',
				'co.id', 'co.moveTargetType', 'co.targetId', 'co.content',
				'coim.itemId', 'coim.actionType'
			])
			.innerJoin('p.chapter', 'c')
			.innerJoin('p.choiceOptions', 'co')
			.leftJoin('co.choiceOptionItemMappings', 'coim')
			.orderBy('p.id', 'ASC')
			.addOrderBy('co.orderNum', 'ASC')
			.getMany();
	}
}