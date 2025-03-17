import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlConfig } from 'src/config/config.model';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { Page, Chapter, ChoiceOption, ChoiceOptionItemMapping, Ending, EndingRecord, Item, PlayRecord, PlayStatus, User } from './entity';
import { PageRepository } from './repository/page.repository';
import { ChoiceOptionRepository } from './repository/choice-option.repository';
import { ItemRepository } from './repository/item.repository';
import { ChoiceOptionItemMappingRepository } from './repository/choice-option-item-mapping.repository';
import { EndingRepository } from './repository/ending.repository';
import { ChapterRepository } from './repository/chapter.repository';
import { UserRepository } from './repository/user.repository';
import { PlayRecordRepository } from './repository/play-record.repository';
import { EndingRecordRepository } from './repository/ending-record.repository';
import { PlayStatusRepository } from './repository/play-status.repository';

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
			useFactory(configService: ConfigService<MySqlConfig>) {
				return {
					type: 'mysql',
					host: configService.get('MYSQL_HOST', { infer: true }),
					port: configService.get('MYSQL_PORT', { infer: true }),
					username: configService.get('MYSQL_USERNAME', { infer: true }),
					password: configService.get('MYSQL_PASSWORD', { infer: true }),
					database: configService.get('MYSQL_DATABASE', { infer: true }),
					entities,
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
	providers,
	exports: [ TypeOrmModule, ...providers ]
})
export class DatabaseModule {}