import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PageType } from 'src/database/entity/page.entity';
import { ChoiceOptionRepository } from 'src/database/repository/choice-option.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { Transactional } from 'typeorm-transactional';
import { FetchPageDto, SavePageDto } from './page.dto';

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

		const choiceOptions = page.type === PageType.HasChoiceOption
			? await this.choiceOptionRepository.find({
				where: { pageId },
				order: { orderNum: 'ASC' }
			})
			: undefined;

		return plainToInstance(FetchPageDto, {
			...page,
			choiceOptions
		}, { excludeExtraneousValues: true });
	}

	public async addPage(dto: SavePageDto) {
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
	private async saveNewPage(dto: SavePageDto) {
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
