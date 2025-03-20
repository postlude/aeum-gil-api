import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlayRecord } from '../entity';

@Injectable()
export class PlayRecordRepository extends Repository<PlayRecord> {
	constructor(private dataSource: DataSource) {
		super(PlayRecord, dataSource.createEntityManager());
	}
}