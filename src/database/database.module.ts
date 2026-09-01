import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from 'src/config/config.model';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import {
	Page,
	Chapter,
	ChoiceOption,
	ChoiceOptionItemMapping,
	Ending,
	EndingRecord,
	Item,
	PlayRecord,
	PlayStatus,
	User
} from './entity';
import {
	PageRepository,
	ChapterRepository,
	ChoiceOptionItemMappingRepository,
	ChoiceOptionRepository,
	EndingRecordRepository,
	EndingRepository,
	ItemRepository,
	PlayRecordRepository,
	PlayStatusRepository,
	UserRepository
} from './repository';
import { KeepAliveService } from './keep-alive.service';

const entities = [ Chapter, ChoiceOptionItemMapping, ChoiceOption, Ending, Item, Page, User, PlayRecord, EndingRecord, PlayStatus ];
const providers = [
	ChapterRepository,
	ChoiceOptionItemMappingRepository,
	ChoiceOptionRepository,
	EndingRepository,
	ItemRepository,
	PageRepository,
	UserRepository,
	PlayRecordRepository,
	EndingRecordRepository,
	PlayStatusRepository
].map((repository) => ({
	provide: repository,
	useFactory: (dataSource: DataSource) => new repository(dataSource),
	inject: [ DataSource ]
}));

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ ConfigService ],
			useFactory(configService: ConfigService<PostgresConfig>) {
				return {
					type: 'postgres',
					host: configService.get('POSTGRES_HOST', { infer: true }),
					port: configService.get('POSTGRES_PORT', { infer: true }),
					username: configService.get('POSTGRES_USERNAME', { infer: true }),
					password: configService.get('POSTGRES_PASSWORD', { infer: true }),
					database: configService.get('POSTGRES_DATABASE', { infer: true }),
					entities,
					ssl: { rejectUnauthorized: false },
					logging: process.env.NODE_ENV === 'local'
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
	providers: [ ...providers, KeepAliveService ],
	exports: [ TypeOrmModule, ...providers ]
})
export class DatabaseModule {}