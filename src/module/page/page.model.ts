import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class PageInfo {
	@ApiPropertyOptional({ type: Number, description: '챕터 id', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public chapterId?: number;

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