import { Body, Controller, Get, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/core/auth-user.decorator';
import { SignInUser } from 'src/core/core.model';
import { SignInRequired } from 'src/core/sign-in-required.guard';
import { GameEnding, GameItem, GamePage, SavePlayRecordDto } from './game.dto';
import { GameService } from './game.service';
import { GameStatus } from 'src/database/entity/play-status.entity';

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

	@Get('/endings')
	@ApiOperation({ summary: '전체 엔딩 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: [ GameEnding ] })
	public async getAllGameEndings(
		@AuthUser() { userId }: SignInUser
	) {
		return await this.gameService.getAllGameEndings(userId);
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

	@Put('/ending-records')
	@ApiOperation({ summary: '엔딩 클리어 정보 저장' })
	@ApiResponse({ status: HttpStatus.CREATED })
	public async saveEndingRecord(
		@AuthUser() { userId }: SignInUser,
		@Body() { endingId }: { endingId: number }
	) {
		await this.gameService.saveEndingRecord({ userId, endingId });
	}

	@Get('/play-status')
	@ApiOperation({ summary: '유저의 현재 플레이 상태 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: GameStatus })
	public async getPlayStatus(
		@AuthUser() { userId }: SignInUser
	) {
		return await this.gameService.getPlayStatus(userId);
	}
}