import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PageRepository } from 'src/database/repository/page.repository';
import { FetchPageDto, SavePageDto } from './page.dto';
import { PageInfo } from './page.model';

@Injectable()
export class PageService {
	constructor(
		private readonly pageRepository: PageRepository
	) {}

	public async getPage(pageId: number) {
		const page = await this.pageRepository.findWithChoiceOptions(pageId);
		if (!page) {
			throw new NotFoundException();
		}

		return plainToInstance(FetchPageDto, page, { excludeExtraneousValues: true });
	}

	public async savePage(page: SavePageDto, pageId?: number) {
		// 혹시라도 type에 정의되어 있지 않지만, fe에서 값이 전달될 경우를 대비해 선언되지 않은 값들을 제거
		const parsed = plainToInstance(PageInfo, page, { excludeExtraneousValues: true });
		const result = await this.pageRepository.save({ ...parsed, id: pageId });
		return result.id;
	}

	public async removePage(pageId: number) {
		// ON DELETE CASCADE 로 FK로 연결된 다른 데이터도 삭제됨
		await this.pageRepository.delete({ id: pageId });
	}
}
