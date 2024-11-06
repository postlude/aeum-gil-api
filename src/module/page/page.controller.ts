import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PageService } from './page.service';
import { PageDto } from './page.dto';

@Controller('/pages')
export class PageController {
	constructor(
		private readonly pageService: PageService
	) {}

	@Get('/:pageId')
	public async getPage(
		@Param('pageId', ParseIntPipe) pageId: number
	) {
		return await this.pageService.getPage(pageId);
	}

	@Post('/')
	public async addPage(
		@Body() body: PageDto
	) {
		const pageId = await this.pageService.addPage(body);
		return pageId;
	}

	@Put('/:pageId')
	public async setPage(
		@Param('pageId', ParseIntPipe) pageId: number,
		@Body() body: PageDto
	) {
		await this.pageService.setPage(pageId, body);
		return pageId;
	}
}