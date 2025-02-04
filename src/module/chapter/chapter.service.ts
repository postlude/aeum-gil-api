import { Injectable } from '@nestjs/common';
import { ChapterRepository } from 'src/database/repository/chapter.repository';

@Injectable()
export class ChapterService {
	constructor(
		private readonly chapterRepository: ChapterRepository
	) {}

	public async saveChapter(title: string, chapterId?: number) {
		const result = await this.chapterRepository.save({
			title,
			id: chapterId
		});
		return result.id;
	}
}
