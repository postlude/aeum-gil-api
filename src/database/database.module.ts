import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/page.entity';
import { PageRepository } from './repository/page.repository';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

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
		TypeOrmModule.forRootAsync({
			useFactory() {
				return {
					type: 'mysql',
					host: 'localhost',
					port: 3307,
					username: 'circuitous-road',
					password: 'circuitous-road',
					database: 'circuitous_road',
					entities,
					logging: true
				};
			},
			async dataSourceFactory(options) {
				if (!options) {
					throw new Error('Invalid options passed');
				}
				return addTransactionalDataSource(new DataSource(options));
			}
		}),
		TypeOrmModule.forFeature(entities)
	],
	providers,
	exports: [ TypeOrmModule, ...providers ]
})
export class DatabaseModule {}