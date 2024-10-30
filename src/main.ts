import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = 3000;

	app.enableCors({
		origin: [ /localhost/ ]
	});

	await app.listen(port);

	console.log('[CIRCUITOUS-ROAD API]');
	console.log(`PORT : ${port}`);
}
bootstrap();
