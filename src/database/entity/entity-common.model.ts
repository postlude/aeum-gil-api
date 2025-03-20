import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/**
 * 선택지 선택시 이동할 대상
 */
export enum MoveTargetType {
	Page = 1,
	Ending
}

/**
 * 현재 소유한 아이템 정보
 */
export class OwnedItem {
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
