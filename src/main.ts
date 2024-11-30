import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MySqlConfig } from './config/config.model';

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule);
	const port = 3000;

	app.enableCors({
		origin: [ /localhost/ ]
	});

	const swaggerConfig = new DocumentBuilder()
		.setTitle('에움길 API')
		.setVersion('0.2.0')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('swagger', app, documentFactory);

	await app.listen(port);

	const mysqlHost = app.get(ConfigService<MySqlConfig>)
		.get('MYSQL_HOST', { infer: true });

	console.log('[AEUM-GIL API]');
	console.log(`PORT : ${port}`);
	console.log(`MySQL Host : ${mysqlHost}`);
}
bootstrap();
