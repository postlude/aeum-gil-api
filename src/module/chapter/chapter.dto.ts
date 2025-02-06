import { ApiProperty } from '@nestjs/swagger';
import { ChapterInfo } from './chapter.model';
import { Expose } from 'class-transformer';

export class SaveChapterDto extends ChapterInfo {}

export class ChapterDto extends ChapterInfo {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;

	@ApiProperty({ type: Date })
	@Expose()
	public createdAt: Date;

	@ApiProperty({ type: Date })
	@Expose()
	public updatedAt: Date;
}