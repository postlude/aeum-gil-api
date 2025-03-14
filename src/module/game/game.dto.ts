import { ApiProperty, OmitType } from '@nestjs/swagger';
import { FetchItemDto } from '../item/item.dto';
import { ChapterInfo } from '../chapter/chapter.model';
import { MoveTargetType } from 'src/database/entity/choice-option.entity';
import { Expose, Type } from 'class-transformer';
import { ChoiceOptionItemMappingInfo } from '../choice-option/choice-option.model';
import { IsInt, Min } from 'class-validator';
import { EndingInfo } from '../ending/ending.model';

export class GameItem extends OmitType(FetchItemDto, [ 'importance' ]) {}

class GameChapter extends ChapterInfo {}

class GameChoiceOption {
	@ApiProperty({ type: Number, minimum: 1 })
	@Expose()
	public choiceOptionId: number;

	@ApiProperty({ enum: MoveTargetType, enumName: 'MoveTargetType', description: '선택지 선택시 이동할 대상(1: 페이지, 2: 엔딩)' })
	@Expose()
	public moveTargetType: MoveTargetType;

	@ApiProperty({ type: Number, description: '다음 페이지 id or 엔딩 id', minimum: 1 })
	@Expose()
	public targetId: number;

	@ApiProperty({ type: String, description: '내용', maxLength: 300 })
	@Expose()
	public content: string;

	@ApiProperty({ type: [ ChoiceOptionItemMappingInfo ], description: '선택지 아이템' })
	@Type(() => ChoiceOptionItemMappingInfo)
	@Expose()
	public items?: ChoiceOptionItemMappingInfo[];
}

export class GamePage {
	@ApiProperty({ type: Number })
	@Expose()
	public pageId: number;

	@ApiProperty({ type: String, description: '제목', maxLength: 200 })
	@Expose()
	public title: string;

	@ApiProperty({ type: String, description: '장소', maxLength: 30 })
	@Expose()
	public place: string;

	@ApiProperty({ type: String, description: '본문' })
	@Expose()
	public content: string;

	@ApiProperty({ type: GameChapter, description: '챕터' })
	@Type(() => GameChapter)
	@Expose()
	public chapter: GameChapter;

	@ApiProperty({ type: [ GameChoiceOption ], description: '선택지' })
	@Type(() => GameChoiceOption)
	@Expose()
	public choiceOptions: GameChoiceOption[];
}

export class SavePlayRecordDto {
	@ApiProperty({ type: Number, description: '플레이한 페이지 id', minimum: 1 })
	@IsInt()
	@Min(1)
	public pageId: number;

	@ApiProperty({ type: Number, description: '선택한 선택지 id', minimum: 1 })
	@IsInt()
	@Min(1)
	public choiceOptionId: number;
}

export class GameEnding extends EndingInfo {
	@ApiProperty({ type: Boolean, description: '해당 엔딩이 클리어되었는지 여부' })
	@Expose()
	public isCleared: boolean;
}