import { Body, Controller, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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

	@Put('/:chapterId')
	@ApiOperation({ summary: '챕터 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 chapter.id' })
	public async setChapter(
		@Param('chapterId', ParseIntPipe) chapterId: number,
		@Body() { title }: SaveChapterDto
	) {
		await this.chapterService.saveChapter(title, chapterId);
		return chapterId;
	}
}