import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule);
	const port = 4000;

	app.enableCors({
		origin: [ /localhost/ ]
	});

	await app.listen(port);

	console.log('[AEUM-GIL API]');
	console.log(`PORT : ${port}`);
}
bootstrap();
