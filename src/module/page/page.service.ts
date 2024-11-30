import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PageRepository } from 'src/database/repository/page.repository';
import { PageDto } from './page.dto';
import { Transactional } from 'typeorm-transactional';
import { ChoiceOptionRepository } from 'src/database/repository/choice-option.repository';
import { PageType } from 'src/database/entity/page.entity';

@Injectable()
export class PageService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly choiceOptionRepository: ChoiceOptionRepository
	) {}

	public async getPage(pageId: number) {
		const page = await this.pageRepository.findOneBy({ id: pageId });
		if (!page) {
			throw new NotFoundException();
		}
		return page;
	}

	public async addPage(dto: PageDto) {
		const { choiceOptions, ...page } = dto;

		if (page.nextPageId) {
			const count = await this.pageRepository.countBy({ id: page.nextPageId });
			if (!count) {
				throw new NotFoundException(`${page.nextPageId}에 해당하는 페이지가 없습니다.`);
			}
		}

		return this.saveNewPage(dto);
	}

	@Transactional()
	private async saveNewPage(dto: PageDto) {
		const { choiceOptions, ...page } = dto;

		const result = await this.pageRepository.insert(page);
		const pageId = result.identifiers[0].id as number;

		if (page.type === PageType.HasChoiceOption) {
			if (!choiceOptions?.length) {
				throw new BadRequestException('선택지가 필요합니다.');
			}

			const options = choiceOptions.map((option, index) => ({
				pageId,
				orderNum: index + 1,
				...option
			}));

			await this.choiceOptionRepository.insert(options);
		}

		return pageId;
	}

	public async setPage(pageId: number, page: PageDto) {
		await this.pageRepository.update(pageId, page);
	}
}
