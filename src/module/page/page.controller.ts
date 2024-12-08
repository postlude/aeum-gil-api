import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FetchPageDto, SavePageDto } from './page.dto';
import { PageService } from './page.service';

@Controller('/pages')
@ApiTags('Page')
export class PageController {
	constructor(
		private readonly pageService: PageService
	) {}

	@Get('/:pageId')
	@ApiOperation({ summary: '페이지 1건 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: FetchPageDto })
	public async getPage(
		@Param('pageId', ParseIntPipe) pageId: number
	) {
		return await this.pageService.getPage(pageId);
	}

	@Post('/')
	@ApiOperation({ summary: '페이지 생성' })
	@ApiResponse({ status: HttpStatus.CREATED, type: Number, description: '생성된 page.id' })
	public async addPage(
		@Body() body: SavePageDto
	) {
		const pageId = await this.pageService.addPage(body);
		return pageId;
	}

	@Put('/:pageId')
	@ApiOperation({ summary: '페이지 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 page.id' })
	public async setPage(
		@Param('pageId', ParseIntPipe) pageId: number,
		@Body() body: SavePageDto
	) {
		await this.pageService.setPage(pageId, body);
		return pageId;
	}

	@Delete('/:pageId')
	@ApiOperation({ summary: '페이지 삭제' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '삭제된 page.id' })
	public async removePage(
		@Param('pageId', ParseIntPipe) pageId: number
	) {
		await this.pageService.removePage(pageId);
		return pageId;
	}
}