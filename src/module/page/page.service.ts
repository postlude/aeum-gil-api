import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChoiceOptionItemMappingRepository } from 'src/database/repository/choice-option-item-mapping.repository';
import { PageRepository } from 'src/database/repository/page.repository';
import { isExists } from 'src/util/validator';
import { In } from 'typeorm';
import { PageChoiceOptionItem, PageDto, SavePageBody } from './page.dto';
import { PageInfo } from './page.model';

@Injectable()
export class PageService {
	constructor(
		private readonly pageRepository: PageRepository,
		private readonly choiceOptionItemMappingRepository: ChoiceOptionItemMappingRepository
	) {}

	public async getPage(pageId: number) {
		const page = await this.pageRepository.findWithChoiceOptions(pageId);
		if (!page) {
			throw new NotFoundException();
		}

		const parsed = plainToInstance(PageDto, page, { excludeExtraneousValues: true });

		await this.setItemMappings([ parsed ]);

		return parsed;
	}

	private async setItemMappings(pages: PageDto[]) {
		const choiceOptionIds = pages.map(({ choiceOptions }) => choiceOptions?.map(({ id }) => id))
			.flat()
			.filter(isExists);
		if (!choiceOptionIds?.length) {
			return;
		}

		const itemMappings = await this.choiceOptionItemMappingRepository.findBy({ choiceOptionId: In(choiceOptionIds) });
		if (!itemMappings.length) {
			return;
		}

		pages.forEach(({ choiceOptions }) => {
			choiceOptions?.forEach((choiceOption) => {
				const filtered = itemMappings.filter(({ choiceOptionId }) => choiceOptionId === choiceOption.id);
				if (filtered.length) {
					choiceOption.items = plainToInstance(PageChoiceOptionItem, filtered, { excludeExtraneousValues: true });
				}
			});
		});
	}

	public async savePage(page: SavePageBody, pageId?: number) {
		// 혹시라도 type에 정의되어 있지 않지만, fe에서 값이 전달될 경우를 대비해 선언되지 않은 값들을 제거
		const parsed = plainToInstance(PageInfo, page, { excludeExtraneousValues: true });
		const result = await this.pageRepository.save({ ...parsed, id: pageId });
		return result.id;
	}

	public async removePage(pageId: number) {
		// ON DELETE CASCADE 로 FK로 연결된 다른 데이터도 삭제됨
		await this.pageRepository.delete({ id: pageId });
	}

	public async getAllPages() {
		const pages = await this.pageRepository.findAllWithChoiceOptions();

		const parsed = plainToInstance(PageDto, pages, { excludeExtraneousValues: true });

		await this.setItemMappings(parsed);

		return parsed;
	}
}
