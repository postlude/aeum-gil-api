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

const entities = [ Page, ChoiceOption, Item, ChoiceOptionItemMapping ];
const providers = [ PageRepository, ChoiceOptionRepository, ItemRepository, ChoiceOptionItemMappingRepository ]
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