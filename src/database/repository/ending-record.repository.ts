import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EndingRecord } from '../entity/ending-record.entity';

@Injectable()
export class EndingRecordRepository extends Repository<EndingRecord> {
	constructor(private dataSource: DataSource) {
		super(EndingRecord, dataSource.createEntityManager());
	}

	public async insertIgnore(params: {
		userId: number,
		endingId: number
	}) {
		return await this.createQueryBuilder()
			.comment('EndingRecordRepository.insertIgnore')
			.insert()
			.values(params)
			.orIgnore()
			.execute();
	}
}