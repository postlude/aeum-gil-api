import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { FetchChoiceOptionDto } from '../choice-option/choice-option.dto';

export class PageDtoCommon {
	@ApiPropertyOptional({ type: String, nullable: true, description: '페이지 설명' })
	@Expose()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	public description?: string | null;

	@ApiProperty({ type: String, description: '제목', maxLength: 200 })
	@Expose()
	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	public title: string;

	@ApiProperty({ type: String, description: '본문' })
	@Expose()
	@IsString()
	@IsNotEmpty()
	public content: string;
}

export class FetchPageDto extends PageDtoCommon {
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

export class SavePageDto extends PageDtoCommon {}