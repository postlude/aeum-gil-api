import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/page.entity';
import { PageRepository } from './repository/page.repository';

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3307,
			username: 'circuitous-road',
			password: 'circuitous-road',
			database: 'circuitous_road',
			entities: [
				Page
			]
		}),
		TypeOrmModule.forFeature([
			PageRepository
		])
	],
	exports: [ TypeOrmModule ]
})
export class DatabaseModule {}