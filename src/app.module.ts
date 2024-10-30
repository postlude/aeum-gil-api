import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { PageModule } from './module/page/page.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
	imports: [
		DatabaseModule,
		PageModule
	],
	controllers: [ AppController ],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({ transform: true })
		}
	]
})
export class AppModule {}
