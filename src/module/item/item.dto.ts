import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ItemDto {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;

	@ApiProperty({ type: String })
	@Expose()
	public name: string;

	@ApiProperty({ type: String, description: '설명' })
	@Expose()
	public description: string;

	@ApiProperty({ type: Number, description: '중요도' })
	@Expose()
	public importance: number;

	@ApiProperty({ type: String })
	@Expose()
	public image: string;
}