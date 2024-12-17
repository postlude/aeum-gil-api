import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PageInfo } from './page.model';
import { ChoiceOptionInfo, ChoiceOptionItemMappingInfo } from '../choice-option/choice-option.model';

export class GetPageChoiceOptionItem extends ChoiceOptionItemMappingInfo {
	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;
}

class GetPageChoiceOption extends OmitType(ChoiceOptionInfo, [ 'pageId' ]) {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;

	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;

	@ApiPropertyOptional({ type: [ GetPageChoiceOptionItem ], description: '선택지 아이템' })
	@Expose()
	@Type(() => GetPageChoiceOption)
	public items?: GetPageChoiceOptionItem[];
}

export class GetPageResponse extends PageInfo {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;

	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;

	@ApiPropertyOptional({ type: [ GetPageChoiceOption ], description: '선택지' })
	@Expose()
	@Type(() => GetPageChoiceOption)
	public choiceOptions?: GetPageChoiceOption[];
}

export class SavePageBody extends PageInfo {}