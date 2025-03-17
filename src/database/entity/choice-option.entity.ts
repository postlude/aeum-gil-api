import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation
} from 'typeorm';
import { Page } from './page.entity';
import { ChoiceOptionItemMapping } from './choice-option-item-mapping.entity';
import { MoveTargetType } from './entity-common.model';

@Entity({ database: 'aeum_gil', name: 'choice_option', comment: '선택지' })
export class ChoiceOption {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ name: 'page_id', type: 'int', unsigned: true, comment: '선택지가 속한 페이지 id' })
	public pageId: number;

	@Column({ name: 'move_target_type', type: 'tinyint', unsigned: true, comment: '1: 페이지, 2: 엔딩' })
	public moveTargetType: MoveTargetType | null;

	@Column({ name: 'target_id', type: 'int', unsigned: true, nullable: true, comment: '다음 페이지 id or 엔딩 id' })
	public targetId: number | null;

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
	public page?: Relation<Page>;

	@OneToMany(() => ChoiceOptionItemMapping, (choiceOptionItemMapping) => choiceOptionItemMapping.choiceOption)
	public choiceOptionItemMappings?: ChoiceOptionItemMapping[];
}
