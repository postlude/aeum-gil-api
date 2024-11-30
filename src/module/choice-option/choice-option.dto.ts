import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class ChoiceOptionDto {
	@ApiProperty({ type: Number, description: '선택지 순서', minimum: 1 })
	@IsInt()
	@Min(1)
	public orderNum: number;

	@ApiProperty({ type: String, description: '내용', maxLength: 300 })
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	public content: string;
}

export class SaveChoiceOptionDto extends OmitType(ChoiceOptionDto, [ 'orderNum' ]) {}