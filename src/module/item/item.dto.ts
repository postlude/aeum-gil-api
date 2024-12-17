import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUrl, Max, Min } from 'class-validator';

export class ItemDtoCommon {
	@ApiProperty({ type: String })
	@Expose()
	@IsString()
	@IsNotEmpty()
	public name: string;

	@ApiProperty({ type: String, description: '설명' })
	@Expose()
	@IsString()
	@IsNotEmpty()
	public description: string;

	@ApiProperty({ type: Number, description: '중요도', minimum: 1, maximum: 3 })
	@Expose()
	@IsInt()
	@Min(1)
	@Max(3)
	public importance: number;

	@ApiProperty({ type: String })
	@Expose()
	@IsUrl()
	@IsNotEmpty()
	public image: string;
}

export class FetchItemDto extends ItemDtoCommon {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;
}

export class SaveItemDto extends ItemDtoCommon {}