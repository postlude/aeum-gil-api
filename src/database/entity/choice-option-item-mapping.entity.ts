import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { ChoiceOption } from './choice-option.entity';

export enum ItemActionType {
	Gain = 1,
	Loss,
	RandomGain
}

@Entity({ name: 'choice_option_item_mapping', comment: '선택지-아이템 매핑' })
export class ChoiceOptionItemMapping {
	@PrimaryColumn({ name: 'choice_option_id', type: 'int' })
	public choiceOptionId: number;

	@PrimaryColumn({ name: 'item_id', type: 'int' })
	public itemId: number;

	@Column({ name: 'action_type', type: 'smallint', comment: '1: 획득, 2: 소모, 3: 랜덤 획득' })
	public actionType: ItemActionType;

	@Column({ name: 'created_at', type: 'timestamptz' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'timestamptz' })
	public updatedAt: Date;

	@ManyToOne(() => ChoiceOption, (choiceOption) => choiceOption.choiceOptionItemMappings)
	@JoinColumn({ name: 'choice_option_id', referencedColumnName: 'id' })
	public choiceOption?: Relation<ChoiceOption>;
}
