import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PageService } from './page.service';

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
}