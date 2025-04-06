import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation
} from 'typeorm';
import { ChoiceOption } from './choice-option.entity';
import { Chapter } from './chapter.entity';
import { PlayRecord } from './play-record.entity';

@Entity({ database: 'aeum_gil', name: 'page', comment: '페이지' })
export class Page {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ name: 'chapter_id', type: 'int', unsigned: true, nullable: true })
	public chapterId: number | null;

	@Column({ type: 'varchar', length: 30, comment: '장소' })
	public place: string;

	@Column({ type: 'text', comment: '본문' })
	public content: string;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;

	@ManyToOne(() => Chapter, (chapter) => chapter.pages)
	@JoinColumn({ name: 'chapter_id' })
	public chapter?: Relation<Chapter>;

	@OneToMany(() => ChoiceOption, (choiceOption) => choiceOption.page)
	public choiceOptions?: ChoiceOption[];

	@OneToMany(() => PlayRecord, (playRecord) => playRecord.page)
	public playRecords?: PlayRecord[];
}
