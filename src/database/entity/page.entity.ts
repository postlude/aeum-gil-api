import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ database: 'aeum_gil', name: 'page', comment: '페이지' })
export class Page {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ type: 'varchar', length: 300, nullable: true, comment: '페이지 설명' })
	public description: string | null;

	@Column({ type: 'varchar', length: 200, comment: '제목' })
	public title: string;

	@Column({ type: 'text', comment: '본문' })
	public content: string;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;

	// @ManyToOne(() => Page, (page) => page.id, { nullable: true })
	// @JoinColumn({ name: 'prev_page_id' })
	// public previousPage: Page | null;
}
