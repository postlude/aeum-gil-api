import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChoiceOption } from '../entity';

@Injectable()
export class ChoiceOptionRepository extends Repository<ChoiceOption> {
	constructor(private dataSource: DataSource) {
		super(ChoiceOption, dataSource.createEntityManager());
	}
}