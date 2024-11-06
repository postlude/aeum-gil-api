import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { PageModule } from './module/page/page.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		// When a key exists both in the runtime environment as an environment variable and in a .env file, the runtime environment variable takes precedence.
		ConfigModule.forRoot({
			envFilePath: [ 'src/config/local.env' ],
			isGlobal: true
		}),
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
