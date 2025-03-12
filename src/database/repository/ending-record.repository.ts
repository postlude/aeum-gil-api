import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EndingRecord } from '../entity/ending-record.entity';

@Injectable()
export class EndingRecordRepository extends Repository<EndingRecord> {
	constructor(private dataSource: DataSource) {
		super(EndingRecord, dataSource.createEntityManager());
	}
}