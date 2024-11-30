import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { PageType } from 'src/database/entity/page.entity';
import { ChoiceOptionDto } from '../choice-option/choice-option.dto';
import { Type } from 'class-transformer';

export class PageDto {
	@ApiProperty({ type: Number, nullable: true, description: '선택지가 없는 타입인 경우 다음 페이지 id' })
	@IsOptional()
	@IsInt()
	@Min(1)
	public nextPageId?: number | null;

	@ApiPropertyOptional({ type: String, nullable: true, description: '페이지 설명' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	public description?: string | null;

	@ApiProperty({ enum: PageType, enumName: 'PageType', description: '1: content only, 2: 선택지 존재' })
	@IsEnum(PageType)
	public type: PageType;

	@ApiProperty({ type: String, description: '제목', maxLength: 200 })
	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	public title: string;

	@ApiProperty({ type: String, description: '본문' })
	@IsString()
	@IsNotEmpty()
	public content: string;

	@ApiPropertyOptional({ type: [ ChoiceOptionDto ], description: '선택지' })
	@IsOptional()
	@Type(() => ChoiceOptionDto)
	@IsArray()
	@ValidateNested({ each: true })
	public choiceOptions?: ChoiceOptionDto[];
}