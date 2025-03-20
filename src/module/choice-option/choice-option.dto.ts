import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsInt } from 'class-validator';
import { ItemActionType } from 'src/database/entity';
import { ChoiceOptionInfo, ChoiceOptionItemMappingInfo } from './choice-option.model';

export class AddChoiceOptionBody extends ChoiceOptionInfo {}

export class SetChoiceOptionBody extends OmitType(ChoiceOptionInfo, [ 'pageId' ]) {}

export class ReorderChoiceOptionsBody {
	@ApiProperty({ type: [ Number ], description: '정렬할 선택지 id 배열. 배열 순서대로 orderNum이 1부터 세팅됨' })
	@ArrayNotEmpty()
	@IsInt({ each: true })
	public choiceOptionIds: number[];
}

export class ReorderChoiceOptionsResponse {
	@ApiProperty({ type: Number })
	public choiceOptionId: number;

	@ApiProperty({ type: Number })
	public orderNum: number;
}

export class AddChoiceOptionItemBody extends ChoiceOptionItemMappingInfo {}

export class SetChoiceOptionItemBody {
	@ApiProperty({ enum: ItemActionType, enumName: 'ItemActionType', description: '1: 획득, 2: 소모' })
	@IsEnum(ItemActionType)
	public actionType: ItemActionType;
}