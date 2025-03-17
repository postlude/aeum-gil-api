import { MoveTargetType } from 'src/database/entity/entity-common.model';

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