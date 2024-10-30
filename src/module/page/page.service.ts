import { Injectable, NotFoundException } from '@nestjs/common';
import { PageRepository } from 'src/database/repository/page.repository';
import { PageDto } from './page.dto';

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

	public async addPage(page: PageDto) {
		const result = await this.pageRepository.insert(page);
		return result.identifiers[0].id as number;
	}

	public async setPage(pageId: number, page: PageDto) {
		await this.pageRepository.update(pageId, page);
	}
}
