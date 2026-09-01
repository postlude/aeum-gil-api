import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'ending', comment: '엔딩' })
export class Ending {
	@PrimaryGeneratedColumn({ type: 'int' })
	public id: number;

	@Column({ type: 'varchar', length: 200, comment: '제목' })
	public title: string;

	@Column({ type: 'text', comment: '본문' })
	public content: string;

	@Column({ name: 'order_num', type: 'smallint', comment: '엔딩 순서' })
	public orderNum: number;

	@Column({ name: 'return_page_id', type: 'int', comment: '엔딩 후 되돌아갈 page.id' })
	public returnPageId: number;

	@Column({ name: 'created_at', type: 'timestamptz' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'timestamptz' })
	public updatedAt: Date;
}
