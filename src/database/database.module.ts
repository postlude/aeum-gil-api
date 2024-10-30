import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/page.entity';
import { PageRepository } from './repository/page.repository';
import { DataSource } from 'typeorm';

const entities = [ Page ];
const providers = [ PageRepository ]
	.map((repository) => ({
		provide: repository,
		useFactory: (dataSource: DataSource) => new repository(dataSource),
		inject: [ DataSource ]
	}));

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
			entities
		}),
		TypeOrmModule.forFeature(entities)
	],
	providers,
	exports: [ TypeOrmModule, ...providers ]
})
export class DatabaseModule {}