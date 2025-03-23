import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { ArrayUtil } from 'src/util/array-util.service';

@Module({
	controllers: [ GameController ],
	providers: [ GameService, ArrayUtil ]
})
export class GameModule {}
