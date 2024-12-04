import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

export enum ItemActionType {
	Gain = 1,
	Loss
}

@Entity({ database: 'aeum_gil', name: 'choice_option_item_mapping', comment: '선택지-아이템 매핑' })
export class ChoiceOptionItemMapping {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ type: 'int', unsigned: true })
	public choiceOptionId: number;

	@Column({ type: 'int', unsigned: true })
	public itemId: number;

	@Column({ type: 'tinyint', unsigned: true, comment: '1: 획득, 2: 소모' })
	public actionType: ItemActionType;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;
}
