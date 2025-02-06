import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ database: 'aeum_gil', name: 'chapter', comment: '챕터' })
export class Chapter {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ type: 'varchar', length: 200, comment: '챕터 제목' })
	public title: string;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;
}
