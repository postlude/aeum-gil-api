import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChoiceOptionItemMapping } from '../entity/choice-option-item-mapping.entity';

@Injectable()
export class ChoiceOptionItemMappingRepository extends Repository<ChoiceOptionItemMapping> {
	constructor(private dataSource: DataSource) {
		super(ChoiceOptionItemMapping, dataSource.createEntityManager());
	}
}