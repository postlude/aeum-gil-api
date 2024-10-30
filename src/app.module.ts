import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PageModule } from './module/page/page.module';

@Module({
	imports: [
		DatabaseModule,
		PageModule
	],
	controllers: [ AppController ],
	providers: [ AppService ]
})
export class AppModule {}
