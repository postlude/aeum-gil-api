import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsInt, Min, ValidateNested } from 'class-validator';
import { MoveTargetType } from './choice-option.entity';

class OwnedItem {
	@ApiProperty({ type: Number, description: '아이템 id' })
	@Expose()
	@IsInt()
	@Min(1)
	public itemId: number;

	@ApiProperty({ type: Number, description: '아이템 수량' })
	@Expose()
	@IsInt()
	@Min(1)
	public count: number;
}

export class GameStatus {
	@ApiProperty({ enum: MoveTargetType, enumName: 'MoveTargetType', description: '선택지 선택시 이동할 대상(1: 페이지, 2: 엔딩)' })
	@Expose()
	@IsEnum(MoveTargetType)
	public moveTargetType: MoveTargetType;

	@ApiProperty({ type: Number, description: '다음 페이지 id or 엔딩 id', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public targetId: number;

	@ApiProperty({ type: [ OwnedItem ], description: '소지 아이템' })
	@Type(() => OwnedItem)
	@Expose()
	@ValidateNested()
	@ArrayNotEmpty()
	public ownedItems: OwnedItem[];
}