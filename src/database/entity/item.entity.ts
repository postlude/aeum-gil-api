import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ database: 'aeum_gil', name: 'item', comment: '아이템' })
export class Item {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ type: 'varchar', length: 100 })
	public name: string;

	@Column({ type: 'varchar', length: 200, comment: '설명' })
	public description: string;

	@Column({ type: 'tinyint', unsigned: true, comment: '중요도' })
	public importance: number;

	@Column({ type: 'varchar', length: 400 })
	public image: string;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;
}
