import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class PageInfo {
	@ApiPropertyOptional({ type: Number, description: '챕터 id', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public chapterId?: number;

	@ApiPropertyOptional({ type: String, nullable: true, description: '페이지 설명. 유저에게 노출되지 않음' })
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

	@ApiProperty({ type: String, description: '장소', maxLength: 30 })
	@Expose()
	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	public place: string;

	@ApiProperty({ type: String, description: '본문' })
	@Expose()
	@IsString()
	@IsNotEmpty()
	public content: string;
}