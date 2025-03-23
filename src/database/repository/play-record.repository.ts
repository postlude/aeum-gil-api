import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlayRecord } from '../entity';

@Injectable()
export class PlayRecordRepository extends Repository<PlayRecord> {
	constructor(private dataSource: DataSource) {
		super(PlayRecord, dataSource.createEntityManager());
	}

	public async findOneByPk(userId: number, pageId: number) {
		return await this.createQueryBuilder('pr')
			.comment('PlayRecordRepository.findOneByPk')
			.innerJoin('pr.user', 'u')
			.innerJoin('pr.page', 'p')
			.where('pr.userId = :userId', { userId })
			.andWhere('pr.pageId = :pageId', { pageId })
			.getOne();
	}
}