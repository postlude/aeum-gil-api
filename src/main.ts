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
		origin: [ /localhost/, /aeum-gil.com/ ]
	});

	const swaggerConfig = new DocumentBuilder()
		.setTitle('에움길 API')
		.setVersion('0.7.0')
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig, {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
	});
	SwaggerModule.setup('swagger', app, document);

	await app.listen(port);

	const mysqlHost = app.get(ConfigService<MySqlConfig>)
		.get('MYSQL_HOST', { infer: true });

	console.log('========== [AEUM-GIL API] ==========');
	console.log(`PORT : ${port}`);
	console.log(`MySQL Host : ${mysqlHost}`);
}
bootstrap();
