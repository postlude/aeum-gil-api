import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}