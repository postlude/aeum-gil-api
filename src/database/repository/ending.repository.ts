import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Ending } from '../entity/ending.entity';

@Injectable()
export class EndingRepository extends Repository<Ending> {
	constructor(private dataSource: DataSource) {
		super(Ending, dataSource.createEntityManager());
	}
}