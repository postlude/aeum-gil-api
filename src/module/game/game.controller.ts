import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInRequired } from '../auth/jwt/sign-in-required.guard';
import { GameService } from './game.service';
import { GameItem } from './game.dto';

@Controller('/game')
@UseGuards(SignInRequired)
@ApiTags('Game')
@ApiBearerAuth()
export class GameController {
	constructor(
		private readonly gameService: GameService
	) {}

	@Get('/items')
	@ApiOperation({ summary: '전체 게임 아이템 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: [ GameItem ] })
	public async getAllGameItems() {
		return await this.gameService.getAllGameItems();
	}
}