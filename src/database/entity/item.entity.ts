import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'item', comment: '아이템' })
export class Item {
	@PrimaryGeneratedColumn({ type: 'int' })
	public id: number;

	@Column({ type: 'varchar', length: 100 })
	public name: string;

	@Column({ type: 'varchar', length: 200, comment: '설명' })
	public description: string;

	@Column({ type: 'smallint', comment: '중요도' })
	public importance: number;

	@Column({ type: 'varchar', length: 400 })
	public image: string;

	@Column({ name: 'created_at', type: 'timestamptz' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'timestamptz' })
	public updatedAt: Date;
}
