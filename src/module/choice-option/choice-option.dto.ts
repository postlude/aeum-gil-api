import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsInt, Min } from 'class-validator';
import { ChoiceOptionInfo } from './choice-option.model';
import { ItemActionType } from 'src/database/entity/choice-option-item-mapping.entity';

export class FetchChoiceOptionDto extends ChoiceOptionInfo {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;
}

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

export class AddChoiceOptionItemBody {
	@ApiProperty({ type: Number, minimum: 1 })
	@IsInt()
	@Min(1)
	public itemId: number;

	@ApiProperty({ enum: ItemActionType, enumName: 'ItemActionType', description: '1: 획득, 2: 소모' })
	@IsEnum(ItemActionType)
	public actionType: ItemActionType;
}

export class SetChoiceOptionItemBody {
	@ApiProperty({ enum: ItemActionType, enumName: 'ItemActionType', description: '1: 획득, 2: 소모' })
	@IsEnum(ItemActionType)
	public actionType: ItemActionType;
}