import { ApiProperty } from '@nestjs/swagger';
import { EndingInfo } from './ending.model';
import { Expose } from 'class-transformer';

export class SaveEndingBody extends EndingInfo {}

export class EndingDto extends EndingInfo {
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