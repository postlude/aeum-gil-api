import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChoiceOptionRepository } from 'src/database/repository/choice-option.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { SaveChoiceOptionDto } from '../choice-option/choice-option.dto';
import { FetchPageDto, PageDtoCommon, SavePageDto } from './page.dto';
import { isExists } from 'src/util/validator';

@Injectable()
export class PageService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly choiceOptionRepository: ChoiceOptionRepository
	) {}

	public async getPage(pageId: number) {
		const [ page, choiceOptions ] = await Promise.all([
			this.pageRepository.findOneBy({ id: pageId }),
			this.choiceOptionRepository.find({
				where: { pageId },
				order: { orderNum: 'ASC' }
			})
		]);

		if (!page) {
			throw new NotFoundException();
		}

		return plainToInstance(FetchPageDto, {
			...page,
			choiceOptions
		}, { excludeExtraneousValues: true });
	}

	public async addPage(dto: SavePageDto) {
		const nextPageIds = dto.choiceOptions.map(({ nextPageId }) => nextPageId).filter(isExists);
		if (nextPageIds.length) {
			await this.checkNextPageExists(nextPageIds);
		}

		return this.saveNewPage(dto);
	}

	private async checkNextPageExists(nextPageIds: number[]) {
		const count = await this.pageRepository.countBy({ id: In(nextPageIds) });
		if (count !== nextPageIds.length) {
			throw new NotFoundException();
		}

		return true;
	}

	@Transactional()
	private async saveNewPage(dto: SavePageDto) {
		const { choiceOptions, ...page } = dto;

		const result = await this.pageRepository.insert(page);
		const pageId = result.identifiers[0].id as number;

		await this.saveNewChoiceOptions(pageId, choiceOptions);

		return pageId;
	}

	public async setPage(pageId: number, dto: SavePageDto) {
		const nextPageIds = dto.choiceOptions.map(({ nextPageId }) => nextPageId).filter(isExists);

		const [ page ] = await Promise.all([
			this.pageRepository.findOneBy({ id: pageId }),
			this.checkNextPageExists(nextPageIds)
		]);
		if (!page) {
			throw new NotFoundException('해당 페이지가 없습니다.');
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

		await this.saveNewChoiceOptions(pageId, choiceOptions);
	}

	private async saveNewChoiceOptions(pageId: number, choiceOptions: SaveChoiceOptionDto[]) {
		const options = choiceOptions.map(({ nextPageId, content }, index) => ({
			pageId,
			nextPageId,
			orderNum: index + 1,
			content
		}));

		await this.choiceOptionRepository.insert(options);
	}

	public async removePage(pageId: number) {
		// ON DELETE CASCADE 로 choice_option 도 삭제됨
		await this.pageRepository.delete({ id: pageId });
	}
}
