import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ database: 'circuitous_road', name: 'page' })
export class Page {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ type: 'int', unsigned: true, nullable: true, comment: '현재 페이지와 연결된 이전 페이지 id' })
	public prevPageId: number | null;

	@Column({ type: 'varchar', length: 300, nullable: true, comment: '페이지 설명' })
	public description: string | null;

	@Column({ type: 'text', comment: '본문' })
	public content: string;

	@Column({ type: 'datetime', name: 'created_at' })
	public createdAt: Date;

	@Column({ type: 'datetime', name: 'updated_at' })
	public updatedAt: Date;

	// @ManyToOne(() => Page, (page) => page.id, { nullable: true })
	// @JoinColumn({ name: 'prev_page_id' })
	// public previousPage: Page | null;
}
