import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { ChapterDto, SaveChapterDto } from './chapter.dto';
import { AdminOnly } from '../auth/jwt/admin-only.guard';

@Controller('/chapters')
@UseGuards(AdminOnly)
@ApiTags('Chapter')
@ApiBearerAuth()
export class ChapterController {
	constructor(
		private readonly chapterService: ChapterService
	) {}

	@Get('/')
	@ApiOperation({ summary: '챕터 전체 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: [ ChapterDto ] })
	public async getAllChapters() {
		return await this.chapterService.getAllChapters();
	}

	@Post('/')
	@ApiOperation({ summary: '챕터 신규 추가' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '생성된 chapter.id' })
	public async addChapter(
		@Body() { title, image }: SaveChapterDto
	) {
		const chapterId = await this.chapterService.saveChapter({ title, image });
		return chapterId;
	}

	@Put('/:chapterId')
	@ApiOperation({ summary: '챕터 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 chapter.id' })
	public async setChapter(
		@Param('chapterId', ParseIntPipe) chapterId: number,
		@Body() { title, image }: SaveChapterDto
	) {
		await this.chapterService.saveChapter({ title, image, chapterId });
		return chapterId;
	}

	@Delete('/:chapterId')
	@ApiOperation({ summary: '챕터 삭제' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '삭제된 chapter.id' })
	public async removeChapter(
		@Param('chapterId', ParseIntPipe) chapterId: number
	) {
		await this.chapterService.removeChapter(chapterId);
		return chapterId;
	}
}