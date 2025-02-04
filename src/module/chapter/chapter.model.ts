import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChapterInfo {
	@ApiProperty({ type: String, description: '챕터 제목' })
	@Expose()
	@IsString()
	@IsNotEmpty()
	public title: string;
}