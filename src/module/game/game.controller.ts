import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';

@Controller('/game')
@ApiTags('Game')
@ApiBearerAuth()
export class GameController {
	constructor(
		private readonly gameService: GameService
	) {}
}