import {
	Column,
	Entity,
	PrimaryColumn
} from 'typeorm';
import { MoveTargetType, OwnedItem } from './entity-common.model';

@Entity({ name: 'play_status', comment: '유저의 현재 플레이 상태' })
export class PlayStatus {
	@PrimaryColumn({ name: 'user_id', type: 'int' })
	public userId: number;

	@Column({ name: 'move_target_type', type: 'smallint', comment: '1: 페이지, 2: 엔딩' })
	public moveTargetType: MoveTargetType;

	@Column({ name: 'target_id', type: 'int', comment: '다음 페이지 id or 엔딩 id' })
	public targetId: number;

	@Column({ name: 'owned_items', type: 'jsonb', nullable: true, comment: '현재 소유한 아이템 정보' })
	public ownedItems: OwnedItem[] | null;

	@Column({ name: 'created_at', type: 'timestamptz' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'timestamptz' })
	public updatedAt: Date;
}
