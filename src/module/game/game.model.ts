import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MoveTargetType, OwnedItem } from 'src/database/entity/entity-common.model';

// TODO: id 값 확인 후 수정
export const InitialGameStatus = {
	moveTargetType: MoveTargetType.Page,
	targetId: 1,
	ownedItems: [
		{ itemId: 1, count: 1 },
		{ itemId: 2, count: 1 },
		{ itemId: 3, count: 1 }
	]
};

export class PlayStatusInfo {
	@ApiProperty({ enum: MoveTargetType, enumName: 'MoveTargetType', description: '선택지 선택시 이동할 대상(1: 페이지, 2: 엔딩)' })
	@Expose()
	public moveTargetType: MoveTargetType;

	@ApiProperty({ type: Number, description: '다음 페이지 id or 엔딩 id', minimum: 1 })
	@Expose()
	public targetId: number;

	@ApiProperty({ type: [ OwnedItem ], description: '현재 소유한 아이템 정보' })
	@Expose()
	public ownedItems: OwnedItem[];
}
