import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FetchChoiceOptionDto } from '../choice-option/choice-option.dto';
import { PageInfo } from './page.model';

export class FetchPageDto extends PageInfo {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;

	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;

	@ApiProperty({ type: [ FetchChoiceOptionDto ], description: '선택지' })
	@Expose()
	@Type(() => FetchChoiceOptionDto)
	public choiceOptions: FetchChoiceOptionDto[];
}

export class SavePageDto extends PageInfo {}