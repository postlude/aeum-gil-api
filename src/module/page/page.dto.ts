import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { PageType } from 'src/database/entity/page.entity';
import { FetchChoiceOptionDto, SaveChoiceOptionDto } from '../choice-option/choice-option.dto';

export class PageDtoCommon {
	@ApiProperty({ type: Number, nullable: true, description: '선택지가 없는 타입인 경우 다음 페이지 id' })
	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	public nextPageId?: number | null;

	@ApiPropertyOptional({ type: String, nullable: true, description: '페이지 설명' })
	@Expose()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	public description?: string | null;

	@ApiProperty({ enum: PageType, enumName: 'PageType', description: '1: content only, 2: 선택지 존재' })
	@Expose()
	@IsEnum(PageType)
	public type: PageType;

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

	@ApiPropertyOptional({ type: [ FetchChoiceOptionDto ], description: '선택지' })
	@Expose()
	@Type(() => FetchChoiceOptionDto)
	public choiceOptions?: FetchChoiceOptionDto[];
}

export class SavePageDto extends PageDtoCommon {
	@ApiPropertyOptional({ type: [ SaveChoiceOptionDto ], description: '선택지' })
	@IsOptional()
	@Type(() => SaveChoiceOptionDto)
	@IsArray()
	@ValidateNested({ each: true })
	public choiceOptions?: SaveChoiceOptionDto[];
}