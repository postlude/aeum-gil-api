import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ database: 'aeum_gil', name: 'choice_option', comment: '선택지' })
export class ChoiceOption {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ name: 'page_id', type: 'int', unsigned: true })
	public pageId: number;

	@Column({ name: 'order_num', type: 'tinyint', unsigned: true, comment: '선택지 순서' })
	public orderNum: number;

	@Column({ type: 'varchar', length: 300, comment: '내용' })
	public content: string;

	@Column({ type: 'datetime', name: 'created_at' })
	public createdAt: Date;

	@Column({ type: 'datetime', name: 'updated_at' })
	public updatedAt: Date;
}
