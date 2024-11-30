import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChoiceOptionDto {
	@ApiProperty({ type: String, description: '내용', maxLength: 300 })
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	public content: string;
}