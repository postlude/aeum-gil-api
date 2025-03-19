import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChoiceOption } from '../entity';

@Injectable()
export class ChoiceOptionRepository extends Repository<ChoiceOption> {
	constructor(private dataSource: DataSource) {
		super(ChoiceOption, dataSource.createEntityManager());
	}

	public async findOneWithItemMappings(pageId: number, choiceOptionId: number) {
		return await this.createQueryBuilder('co')
			.comment('ChoiceOptionRepository.findOneWithItemMappings')
			.select([ 'co.moveTargetType', 'co.targetId', 'coim.itemId', 'coim.actionType' ])
			.innerJoin('co.page', 'p')
			.leftJoin('co.choiceOptionItemMappings', 'coim')
			.where('p.id = :pageId', { pageId })
			.andWhere('co.id = :choiceOptionId', { choiceOptionId })
			.getOne();
	}
}