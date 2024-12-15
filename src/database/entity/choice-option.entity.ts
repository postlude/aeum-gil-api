import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation
} from 'typeorm';
import { Page } from './page.entity';

@Entity({ database: 'aeum_gil', name: 'choice_option', comment: '선택지' })
export class ChoiceOption {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ name: 'page_id', type: 'int', unsigned: true, comment: '선택지가 속한 페이지 id' })
	public pageId: number;

	@Column({ name: 'next_page_id', type: 'int', unsigned: true, nullable: true, comment: '선택지 선택시 이동할 다음 페이지 id' })
	public nextPageId: number | null;

	@Column({ name: 'order_num', type: 'tinyint', unsigned: true, comment: '선택지 순서' })
	public orderNum: number;

	@Column({ type: 'varchar', length: 300, comment: '내용' })
	public content: string;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;

	@ManyToOne(() => Page, (page) => page.choiceOptions)
	@JoinColumn({ name: 'page_id' })
	public page: Relation<Page>;
}
