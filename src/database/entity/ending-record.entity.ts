import {
	Column,
	Entity,
	PrimaryColumn
} from 'typeorm';

@Entity({ name: 'ending_record', comment: '엔딩 기록' })
export class EndingRecord {
	@PrimaryColumn({ name: 'user_id', type: 'int' })
	public userId: number;

	@PrimaryColumn({ name: 'ending_id', type: 'int' })
	public endingId: number;

	@Column({ name: 'created_at', type: 'timestamptz' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'timestamptz' })
	public updatedAt: Date;
}
