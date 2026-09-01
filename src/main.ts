import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresConfig } from './config/config.model';

async function bootstrap() {
	initializeTransactionalContext();
	const logger = new Logger('Bootstrap');

	const app = await NestFactory.create(AppModule);
	const port = 3001;

	app.enableCors({
		origin: [ /localhost/, /aeum-gil.com/ ]
	});

	const swaggerConfig = new DocumentBuilder()
		.setTitle('에움길 API')
		.setVersion('1.1.1')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig, {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
	});
	SwaggerModule.setup('swagger', app, document);

	await app.listen(port);

	const postgresHost = app.get(ConfigService<PostgresConfig>)
		.get('POSTGRES_HOST', { infer: true });

	logger.log('========== [AEUM-GIL API] ==========');
	logger.log(`PORT : ${port}`);
	logger.log(`PostgreSQL Host : ${postgresHost}`);
}
bootstrap();
