import {
	Column,
	Entity,
	PrimaryColumn
} from 'typeorm';
import { GameStatus } from './game-status.model';

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
