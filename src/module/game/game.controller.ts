import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { GameItem, GamePage, SavePlayRecordDto } from './game.dto';
import { SignInRequired } from 'src/core/sign-in-required.guard';
import { AuthUser } from 'src/core/auth-user.decorator';
import { SignInUser } from 'src/core/core.model';
import { EndingInfo } from '../ending/ending.model';

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

	@Get('/pages')
	@ApiOperation({ summary: '전체 게임 페이지 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: [ GamePage ] })
	public async getAllGamePages() {
		return await this.gameService.getAllGamePages();
	}

	@Put('/play-records')
	@ApiOperation({ summary: '게임 플레이 기록 저장. 선택지 입력시 호출' })
	@ApiResponse({ status: HttpStatus.CREATED, description: '게임 플레이 기록 저장 성공' })
	public async savePlayRecord(
		@AuthUser() { userId }: SignInUser,
		@Body() body: SavePlayRecordDto
	) {
		await this.gameService.savePlayRecord({ userId, ...body });
	}

	@Put('/endings/:endingId')
	@ApiOperation({ summary: '엔딩 조회 및 엔딩 기록 저장' })
	@ApiResponse({ status: HttpStatus.OK, type: EndingInfo })
	public async saveEndingRecord(
		@AuthUser() { userId }: SignInUser,
		@Param('endingId', ParseIntPipe) endingId: number
	) {
		return await this.gameService.saveEndingRecord({ userId, endingId });
	}
}