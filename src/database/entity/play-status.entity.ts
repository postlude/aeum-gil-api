import {
	Column,
	Entity,
	PrimaryColumn
} from 'typeorm';
import { MoveTargetType } from './choice-option.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class OwnedItem {
	@ApiProperty({ type: Number, description: '아이템 id' })
	@Expose()
	public itemId: number;

	@ApiProperty({ type: Number, description: '아이템 수량' })
	@Expose()
	public count: number;
}

export class GameStatus {
	@ApiProperty({ enum: MoveTargetType, enumName: 'MoveTargetType', description: '선택지 선택시 이동할 대상(1: 페이지, 2: 엔딩)' })
	@Expose()
	public moveTargetType: MoveTargetType;

	@ApiProperty({ type: Number, description: '다음 페이지 id or 엔딩 id', minimum: 1 })
	@Expose()
	public targetId: number;

	@ApiProperty({ type: [ OwnedItem ], description: '소지 아이템' })
	@Type(() => OwnedItem)
	@Expose()
	public ownedItems: OwnedItem[];
}

@Entity({ database: 'aeum_gil', name: 'play_status', comment: '유저의 현재 플레이 상태' })
export class PlayStatus {
	@PrimaryColumn({ name: 'user_id', type: 'int', unsigned: true })
	public userId: number;

	@Column({ name: 'game_status', type: 'json', comment: '다음 플레이할 페이지, 현재 소지 아이템 등' })
	public gameStatus: GameStatus;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;
}
