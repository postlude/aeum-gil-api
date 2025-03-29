import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ChapterInfo } from './chapter.model';
import { Expose } from 'class-transformer';

export class AddChapterBody extends OmitType(ChapterInfo, [ 'firstPageId' ]) {}

export class ModifyChapterBody extends ChapterInfo {}

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