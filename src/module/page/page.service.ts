import { Injectable, NotFoundException } from '@nestjs/common';
import { PageRepository } from 'src/database/repository/page.repository';

@Injectable()
export class PageService {
	constructor(
		private readonly pageRepository: PageRepository
	) {}

	public async getPage(pageId: number) {
		const page = await this.pageRepository.findOneBy({ id: pageId });
		if (!page) {
			throw new NotFoundException();
		}
		return page;
	}
}
