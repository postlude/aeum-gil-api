import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class ChapterInfo {
	@ApiProperty({ type: String, description: '챕터 제목', maxLength: 50 })
	@Expose()
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	public title: string;

	@ApiProperty({ type: String, description: '배경 이미지', maxLength: 400 })
	@Expose()
	@IsString()
	@IsNotEmpty()
	@MaxLength(400)
	public image: string;

	@ApiPropertyOptional({ type: Number, nullable: true, description: '챕터의 첫 번째 page.id', minimum: 1 })
	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	public firstPageId?: number | null;
}