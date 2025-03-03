import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {}

	@Post('/sign-up')
	@ApiOperation({ summary: '회원가입' })
	@ApiResponse({ status: HttpStatus.CREATED, type: String, description: 'jwt access token' })
	@ApiResponse({ status: HttpStatus.CONFLICT, description: '이름 중복' })
	public async signUp(
		@Body() { name, password }: AuthDto
	) {
		const accessToken = await this.authService.signUp(name, password);
		return accessToken;
	}

	@Post('/sign-in')
	@ApiOperation({ summary: '로그인' })
	@ApiResponse({ status: HttpStatus.OK, type: String, description: 'jwt access token' })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '로그인 실패(이름이 없거나 비번 불일치)' })
	public async signIn(
		@Body() { name, password }: AuthDto
	) {
		const accessToken = await this.authService.signIn(name, password);
		return accessToken;
	}
}