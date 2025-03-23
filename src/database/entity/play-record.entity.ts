import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { OwnedItem } from './entity-common.model';
import { User } from './user.entity';
import { Page } from './page.entity';

export interface PlayRecordDetailLog {
	choiceOptionId: number;
	createdAt: Date;
	/** play_record에 저장된 ownedItems는 선택지를 선택하기 전 소유한 아이템 목록 */
	ownedItems: OwnedItem[];
}

@Entity({ database: 'aeum_gil', name: 'play_record', comment: '플레이 기록' })
export class PlayRecord {
	@PrimaryColumn({ name: 'user_id', type: 'int', unsigned: true })
	public userId: number;

	@PrimaryColumn({ name: 'page_id', type: 'int', unsigned: true })
	public pageId: number;

	@Column({ name: 'detail_log', type: 'json', comment: '상세 기록' })
	public detailLog: PlayRecordDetailLog[];

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;

	@ManyToOne(() => User, (user) => user.playRecords)
	@JoinColumn({ name: 'user_id' })
	public user?: User;

	@ManyToOne(() => Page, (page) => page.playRecords)
	@JoinColumn({ name: 'page_id' })
	public page?: Relation<Page>;
}
