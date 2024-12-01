import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PageType } from 'src/database/entity/page.entity';
import { ChoiceOptionRepository } from 'src/database/repository/choice-option.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { Transactional } from 'typeorm-transactional';
import { FetchPageDto, PageDtoCommon, SavePageDto } from './page.dto';
import { SaveChoiceOptionDto } from '../choice-option/choice-option.dto';

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

		await this.saveNewChoiceOptions(page.type, pageId, choiceOptions);

		return pageId;
	}

	public async setPage(pageId: number, dto: SavePageDto) {
		const { choiceOptions, ...pageDto } = dto;

		const [ page, nextPageCount ] = await Promise.all([
			this.pageRepository.findOneBy({ id: pageId }),
			pageDto.nextPageId ? this.pageRepository.countBy({ id: pageDto.nextPageId }) : null
		]);

		if (!page) {
			throw new NotFoundException('해당 페이지가 없습니다.');
		}
		if (pageDto.nextPageId && !nextPageCount) {
			throw new NotFoundException(`${pageDto.nextPageId}에 해당하는 페이지가 없습니다.`);
		}

		await this.modifyPage(pageId, dto);

		return pageId;
	}

	@Transactional()
	private async modifyPage(pageId: number, dto: SavePageDto) {
		const { choiceOptions, ...page } = dto;

		// 혹시라도 type에 정의되어 있지 않지만, fe에서 값이 전달될 경우를 대비해 선언되지 않은 값들을 제거
		const parsed = plainToInstance(PageDtoCommon, page, { excludeExtraneousValues: true });

		const results = await Promise.allSettled([
			this.pageRepository.update(pageId, parsed),
			this.choiceOptionRepository.delete({ pageId })
		]);
		results.forEach((result) => {
			if (result.status === 'rejected') {
				throw result.reason;
			}
		});

		await this.saveNewChoiceOptions(page.type, pageId, choiceOptions);
	}

	private async saveNewChoiceOptions(pageType: PageType, pageId: number, choiceOptions?: SaveChoiceOptionDto[]) {
		if (pageType !== PageType.HasChoiceOption) {
			return;
		}

		if (!choiceOptions?.length) {
			throw new BadRequestException('선택지가 필요합니다.');
		}

		const options = choiceOptions.map(({ content }, index) => ({
			pageId,
			orderNum: index + 1,
			content
		}));

		await this.choiceOptionRepository.insert(options);
	}
}
