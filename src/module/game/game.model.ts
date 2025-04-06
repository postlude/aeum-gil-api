import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MoveTargetType, OwnedItem } from 'src/database/entity/entity-common.model';

export const FirstPageId = 1;

export const InitialGameStatus = {
	moveTargetType: MoveTargetType.Page,
	targetId: FirstPageId,
	ownedItems: null
};

export class PlayStatusInfo {
	@ApiProperty({ enum: MoveTargetType, enumName: 'MoveTargetType', description: '선택지 선택시 이동할 대상(1: 페이지, 2: 엔딩)' })
	@Expose()
	public moveTargetType: MoveTargetType;

	@ApiProperty({ type: Number, description: '다음 페이지 id or 엔딩 id', minimum: 1 })
	@Expose()
	public targetId: number;

	@ApiProperty({ type: [ OwnedItem ], nullable: true, description: '현재 소유한 아이템 정보' })
	@Expose()
	public ownedItems: OwnedItem[] | null;
}
