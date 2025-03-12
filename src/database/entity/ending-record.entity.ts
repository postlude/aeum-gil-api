import {
	Column,
	Entity,
	PrimaryColumn
} from 'typeorm';

@Entity({ database: 'aeum_gil', name: 'ending_record', comment: '엔딩 기록' })
export class EndingRecord {
	@PrimaryColumn({ name: 'user_id', type: 'int', unsigned: true })
	public userId: number;

	@PrimaryColumn({ name: 'ending_id', type: 'int', unsigned: true })
	public endingId: number;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;
}
