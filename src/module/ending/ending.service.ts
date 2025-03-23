import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ChoiceOptionRepository, EndingRepository, PageRepository } from 'src/database/repository';
import { EndingDto, SaveEndingBody } from './ending.dto';
import { plainToInstance } from 'class-transformer';
import { EndingInfo } from './ending.model';
import { Not } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { MoveTargetType } from 'src/database/entity';

@Injectable()
export class EndingService {
	constructor(
		private readonly endingRepository: EndingRepository,
		private readonly choiceOptionRepository: ChoiceOptionRepository,
		private readonly pageRepository: PageRepository
	) {}

	public async saveEnding(ending: SaveEndingBody, endingId?: number) {
		const where = endingId ? {
			orderNum: ending.orderNum,
			id: Not(endingId)
		} : {
			orderNum: ending.orderNum
		};

		const [ endingCount, pageCount ] = await Promise.all([
			this.endingRepository.countBy(where),
			this.pageRepository.countBy({ id: ending.returnPageId })
		]);
		if (endingCount) {
			throw new ConflictException('엔딩 순서는 중복될 수 없습니다.');
		}
		if (!pageCount) {
			throw new NotFoundException('존재하지 않는 페이지입니다.');
		}

		// 혹시라도 type에 정의되어 있지 않지만, fe에서 값이 전달될 경우를 대비해 선언되지 않은 값들을 제거
		const parsed = plainToInstance(EndingInfo, ending, { excludeExtraneousValues: true });
		const result = await this.endingRepository.save({ ...parsed, id: endingId });
		return result.id;
	}

	public async getAllEndings() {
		const endings = await this.endingRepository.find({
			order: {
				orderNum: 'ASC'
			}
		});

		return plainToInstance(EndingDto, endings, { excludeExtraneousValues: true });
	}

	@Transactional()
	public async removeEnding(endingId: number) {
		const results = await Promise.allSettled([
			this.endingRepository.delete({ id: endingId }),
			this.choiceOptionRepository.update({
				moveTargetType: MoveTargetType.Ending,
				targetId: endingId
			}, {
				moveTargetType: null,
				targetId: null
			})
		]);

		results.forEach((result) => {
			if (result.status === 'rejected') {
				throw result.reason;
			}
		});
	}
}
