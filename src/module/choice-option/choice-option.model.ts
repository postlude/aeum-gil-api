import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ItemActionType } from 'src/database/entity/choice-option-item-mapping.entity';

export class ChoiceOptionInfo {
	@ApiProperty({ type: Number, nullable: true, description: '선택지가 속한 페이지 id', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public pageId: number;

	@ApiPropertyOptional({ type: Number, nullable: true, description: '선택지 선택시 이동할 다음 페이지 id', minimum: 1 })
	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	public nextPageId?: number | null;

	@ApiProperty({ type: Number, description: '선택지 순서', minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public orderNum: number;

	@ApiProperty({ type: String, description: '내용', maxLength: 300 })
	@Expose()
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	public content: string;
}

export class ChoiceOptionItemMappingInfo {
	@ApiProperty({ type: Number, minimum: 1 })
	@Expose()
	@IsInt()
	@Min(1)
	public itemId: number;

	@ApiProperty({ enum: ItemActionType, enumName: 'ItemActionType', description: '1: 획득, 2: 소모' })
	@Expose()
	@IsEnum(ItemActionType)
	public actionType: ItemActionType;
}