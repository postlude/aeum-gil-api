import { Module } from '@nestjs/common';
import { EndingController } from './ending.controller';
import { EndingService } from './ending.service';

@Module({
	controllers: [ EndingController ],
	providers: [ EndingService ]
})
export class EndingModule {}
