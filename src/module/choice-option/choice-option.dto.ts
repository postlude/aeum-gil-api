import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ChoiceOptionInfo } from './choice-option.model';

export class FetchChoiceOptionDto extends ChoiceOptionInfo {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;
}

export class AddChoiceOptionDto extends ChoiceOptionInfo {}
export class SetChoiceOptionDto extends OmitType(ChoiceOptionInfo, [ 'pageId' ]) {}