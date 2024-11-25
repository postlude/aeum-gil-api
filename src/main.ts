import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { MySqlConfig } from './config/config.model';

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule);
	const port = 4000;

	app.enableCors({
		origin: [ /localhost/ ]
	});

	await app.listen(port);

	const mysqlHost = app.get(ConfigService<MySqlConfig>)
		.get('MYSQL_HOST', { infer: true });

	console.log('[AEUM-GIL API]');
	console.log(`PORT : ${port}`);
	console.log(`MySQL Host : ${mysqlHost}`);
}
bootstrap();
