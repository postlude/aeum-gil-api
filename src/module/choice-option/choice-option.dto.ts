import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

class ChoiceOptionDtoCommon {
	@ApiProperty({ type: Number, description: '선택지 순서', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public orderNum: number;

	@ApiProperty({ type: String, description: '내용', maxLength: 300 })
	@Expose()
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	public content: string;
}

export class FetchChoiceOptionDto extends ChoiceOptionDtoCommon {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;
}

export class SaveChoiceOptionDto extends OmitType(ChoiceOptionDtoCommon, [ 'orderNum' ]) {}