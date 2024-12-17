import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PageInfo } from './page.model';
import { ChoiceOptionInfo, ChoiceOptionItemMappingInfo } from '../choice-option/choice-option.model';

export class PageChoiceOptionItem extends ChoiceOptionItemMappingInfo {
	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;
}

class PageChoiceOption extends OmitType(ChoiceOptionInfo, [ 'pageId' ]) {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;

	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;

	@ApiPropertyOptional({ type: [ PageChoiceOptionItem ], description: '선택지 아이템' })
	@Expose()
	@Type(() => PageChoiceOptionItem)
	public items?: PageChoiceOptionItem[];
}

export class PageDto extends PageInfo {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;

	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;

	@ApiPropertyOptional({ type: [ PageChoiceOption ], description: '선택지' })
	@Expose()
	@Type(() => PageChoiceOption)
	public choiceOptions?: PageChoiceOption[];
}

export class SavePageBody extends PageInfo {}