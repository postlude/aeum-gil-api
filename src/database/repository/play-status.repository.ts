import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlayStatus } from '../entity/play-status.entity';

@Injectable()
export class PlayStatusRepository extends Repository<PlayStatus> {
	constructor(private dataSource: DataSource) {
		super(PlayStatus, dataSource.createEntityManager());
	}
}