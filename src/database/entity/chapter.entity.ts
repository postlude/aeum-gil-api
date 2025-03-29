import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import { Page } from './page.entity';

@Entity({ database: 'aeum_gil', name: 'chapter', comment: '챕터' })
export class Chapter {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ type: 'varchar', length: 200, comment: '챕터 제목' })
	public title: string;

	@Column({ type: 'varchar', length: 400, comment: '배경 이미지' })
	public image: string;

	@Column({ name: 'first_page_id', type: 'int', unsigned: true, nullable: true, comment: '챕터의 첫 번째 page.id' })
	public firstPageId: number | null;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;

	@OneToMany(() => Page, (page) => page.chapter)
	public pages?: Page[];
}
