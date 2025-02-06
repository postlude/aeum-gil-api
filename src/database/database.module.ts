import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlConfig } from 'src/config/config.model';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { Page } from './entity/page.entity';
import { PageRepository } from './repository/page.repository';
import { ChoiceOption } from './entity/choice-option.entity';
import { ChoiceOptionRepository } from './repository/choice-option.repository';
import { Item } from './entity/item.entity';
import { ChoiceOptionItemMapping } from './entity/choice-option-item-mapping.entity';
import { ItemRepository } from './repository/item.repository';
import { ChoiceOptionItemMappingRepository } from './repository/choice-option-item-mapping.repository';
import { Ending } from './entity/ending.entity';
import { EndingRepository } from './repository/ending.repository';
import { Chapter } from './entity/chapter.entity';
import { ChapterRepository } from './repository/chapter.repository';

const entities = [ Chapter, Page, ChoiceOption, Item, ChoiceOptionItemMapping, Ending ];
const providers = [ ChapterRepository, PageRepository, ChoiceOptionRepository, ItemRepository, ChoiceOptionItemMappingRepository, EndingRepository ]
	.map((repository) => ({
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