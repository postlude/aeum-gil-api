import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChoiceOptionRepository } from 'src/database/repository/choice-option.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { isExists } from 'src/util/validator';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { SaveChoiceOptionDto } from '../choice-option/choice-option.dto';
import { FetchPageDto, PageDtoCommon, SavePageDto } from './page.dto';
import { difference } from 'lodash';

@Injectable()
export class PageService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly choiceOptionRepository: ChoiceOptionRepository
	) {}

	public async getPage(pageId: number) {
		const page = await this.pageRepository.findWithChoiceOptions(pageId);
		if (!page) {
			throw new NotFoundException();
		}

		return plainToInstance(FetchPageDto, page, { excludeExtraneousValues: true });
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

		await this.saveChoiceOptions(pageId, choiceOptions);

		return pageId;
	}

	public async setPage(pageId: number, dto: SavePageDto) {
		const nextPageIds = dto.choiceOptions.map(({ nextPageId }) => nextPageId).filter(isExists);

		const [ page ] = await Promise.all([
			this.pageRepository.findWithChoiceOptions(pageId),
			this.checkNextPageExists(nextPageIds)
		]);
		if (!page) {
			throw new NotFoundException('해당 페이지가 없습니다.');
		}

		const curChoiceOptionIds = page.choiceOptions.map(({ id }) => id);
		await this.modifyPage(pageId, curChoiceOptionIds, dto);

		return pageId;
	}

	@Transactional()
	private async modifyPage(pageId: number, curChoiceOptionIds: number[], dto: SavePageDto) {
		const { choiceOptions, ...page } = dto;

		// 혹시라도 type에 정의되어 있지 않지만, fe에서 값이 전달될 경우를 대비해 선언되지 않은 값들을 제거
		const parsed = plainToInstance(PageDtoCommon, page, { excludeExtraneousValues: true });

		const choiceOptionsIds = choiceOptions.map(({ id }) => id).filter(isExists);
		const willBeDeletedIds = difference(curChoiceOptionIds, choiceOptionsIds);

		const results = await Promise.allSettled([
			this.pageRepository.update(pageId, parsed),
			willBeDeletedIds.length ? this.choiceOptionRepository.delete({ id: In(willBeDeletedIds) }) : null
		]);
		results.forEach((result) => {
			if (result.status === 'rejected') {
				throw result.reason;
			}
		});

		await this.saveChoiceOptions(pageId, choiceOptions);
	}

	private async saveChoiceOptions(pageId: number, choiceOptions: SaveChoiceOptionDto[]) {
		const options = choiceOptions.map(({ id, nextPageId, content }, index) => ({
			id,
			pageId,
			nextPageId,
			orderNum: index + 1,
			content
		}));

		await this.choiceOptionRepository.save(options);
	}

	public async removePage(pageId: number) {
		// ON DELETE CASCADE 로 choice_option 도 삭제됨
		await this.pageRepository.delete({ id: pageId });
	}
}
