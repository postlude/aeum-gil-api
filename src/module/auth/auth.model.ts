import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AuthInfo {
	@ApiProperty({ type: String, maxLength: 50, description: '이름' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	public name: string;

	@ApiProperty({ type: String, maxLength: 500, description: '비밀번호' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	public password: string;
}
