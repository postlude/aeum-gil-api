import { Injectable, NotFoundException } from '@nestjs/common';
import { ChapterRepository, PageRepository } from 'src/database/repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ChapterService {
	constructor(
		private readonly chapterRepository: ChapterRepository,
		private readonly pageRepository: PageRepository
	) {}

	public async saveChapter(params: {
		title: string,
		image: string,
		firstPageId?: number | null,
		chapterId?: number
	}) {
		const { title, image, firstPageId, chapterId } = params;

		if (firstPageId && chapterId) {
			const isExist = !!await this.pageRepository.countBy({ id: firstPageId, chapterId });
			if (!isExist) {
				throw new NotFoundException('해당 챕터에 속하지 않는 페이지입니다.');
			}
		}

		const result = await this.chapterRepository.save({
			title,
			image,
			firstPageId,
			id: chapterId
		});
		return result.id;
	}

	public async getAllChapters() {
		return await this.chapterRepository.find();
	}

	@Transactional()
	public async removeChapter(chapterId: number) {
		// 페이지가 삭제되면 연결된 많은 데이터가 삭제되므로 챕터 삭제시 연결된 데이터만 null 처리
		// fk 조건 때문에 page를 먼저 업데이트 하고 chapter를 삭제해야 한다.
		await this.pageRepository.update({ chapterId }, { chapterId: null });

		await this.chapterRepository.delete({ id: chapterId });
	}
}
