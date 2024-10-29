import { Controller } from '@nestjs/common';
import { PageService } from './page.service';

@Controller('/pages')
export class PageController {
	constructor(
		private readonly pageService: PageService
	) {}
}