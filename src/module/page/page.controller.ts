import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminOnly } from '../auth/jwt/admin-only.guard';
import { PageDto, SavePageBody } from './page.dto';
import { PageService } from './page.service';

@Controller('/pages')
@UseGuards(AdminOnly)
@ApiTags('Page')
@ApiBearerAuth()
export class PageController {
	constructor(
		private readonly pageService: PageService
	) {}

	@Get('/')
	@ApiOperation({ summary: '페이지 전체 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: [ PageDto ] })
	public async getAllPages() {
		return await this.pageService.getAllPages();
	}

	@Post('/')
	@ApiOperation({ summary: '페이지 생성' })
	@ApiResponse({ status: HttpStatus.CREATED, type: Number, description: '생성된 page.id' })
	public async addPage(
		@Body() body: SavePageBody
	) {
		const pageId = await this.pageService.savePage(body);
		return pageId;
	}

	@Put('/:pageId')
	@ApiOperation({ summary: '페이지 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 page.id' })
	public async setPage(
		@Param('pageId', ParseIntPipe) pageId: number,
		@Body() body: SavePageBody
	) {
		await this.pageService.savePage(body, pageId);
		return pageId;
	}

	@Get('/:pageId')
	@ApiOperation({ summary: '페이지 1건 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: PageDto })
	public async getPage(
		@Param('pageId', ParseIntPipe) pageId: number
	) {
		return await this.pageService.getPage(pageId);
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