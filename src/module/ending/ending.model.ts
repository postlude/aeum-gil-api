import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class EndingInfo {
	@ApiProperty({ type: String, description: '제목', maxLength: 200 })
	@Expose()
	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	public title: string;

	@ApiProperty({ type: String, description: '본문' })
	@Expose()
	@IsString()
	@IsNotEmpty()
	public content: string;

	@ApiProperty({ type: Number, description: '엔딩 순서. 중복 불가', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public orderNum: number;

	@ApiProperty({ type: Number, description: '엔딩 후 되돌아갈 page.id', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public returnPageId: number;
}