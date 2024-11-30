import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

export enum PageType {
	ContentOnly = 1,
	HasChoiceOption
}

@Entity({ database: 'aeum_gil', name: 'page', comment: '페이지' })
export class Page {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ name: 'next_page_id', type: 'int', unsigned: true, nullable: true, comment: '선택지가 없는 타입인 경우 다음 페이지 id' })
	public nextPageId: number | null;

	@Column({ type: 'varchar', length: 300, nullable: true, comment: '페이지 설명' })
	public description: string | null;

	@Column({ type: 'tinyint', unsigned: true, comment: '1: content only, 2: 선택지 존재' })
	public type: PageType;

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
