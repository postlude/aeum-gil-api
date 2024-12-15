import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsInt } from 'class-validator';
import { ChoiceOptionInfo } from './choice-option.model';

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