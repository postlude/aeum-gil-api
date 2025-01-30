import { ConflictException, Injectable } from '@nestjs/common';
import { EndingRepository } from 'src/database/repository/ending.repository';
import { SaveEndingBody } from './ending.dto';
import { plainToInstance } from 'class-transformer';
import { EndingInfo } from './ending.model';
import { Not } from 'typeorm';

@Injectable()
export class EndingService {
	constructor(
		private readonly endingRepository: EndingRepository
	) {}

	public async saveEnding(ending: SaveEndingBody, endingId?: number) {
		const where = endingId ? {
			orderNum: ending.orderNum,
			id: Not(endingId)
		} : {
			orderNum: ending.orderNum
		};

		const count = await this.endingRepository.countBy(where);
		if (count) {
			throw new ConflictException('엔딩 순서는 중복될 수 없습니다.');
		}

		// 혹시라도 type에 정의되어 있지 않지만, fe에서 값이 전달될 경우를 대비해 선언되지 않은 값들을 제거
		const parsed = plainToInstance(EndingInfo, ending, { excludeExtraneousValues: true });
		const result = await this.endingRepository.save({ ...parsed, id: endingId });
		return result.id;
	}
}
