import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import { PlayRecord } from './play-record.entity';

@Entity({ database: 'aeum_gil', name: 'user', comment: '유저' })
export class User {
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	public id: number;

	@Column({ type: 'varchar', length: 50 })
	public name: string;

	@Column({ type: 'varchar', length: 500 })
	public password: string;

	@Column({ name: 'created_at', type: 'datetime' })
	public createdAt: Date;

	@Column({ name: 'updated_at', type: 'datetime' })
	public updatedAt: Date;

	@OneToMany(() => PlayRecord, (playRecord) => playRecord.user)
	public playRecords?: PlayRecord[];
}
