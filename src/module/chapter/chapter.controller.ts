import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { SaveChapterDto } from './chapter.dto';

@Controller('/chapters')
@ApiTags('Chapter')
export class ChapterController {
	constructor(
		private readonly chapterService: ChapterService
	) {}

	@Post('/')
	@ApiOperation({ summary: '챕터 신규 추가' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '생성된 chapter.id' })
	public async addChapter(
		@Body() { title }: SaveChapterDto
	) {
		const chapterId = await this.chapterService.saveChapter(title);
		return chapterId;
	}
}