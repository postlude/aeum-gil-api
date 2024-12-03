import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

class ChoiceOptionDtoCommon {
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

export class FetchChoiceOptionDto extends ChoiceOptionDtoCommon {
	@ApiProperty({ type: Number })
	@Expose()
	public id: number;
}

export class SaveChoiceOptionDto extends OmitType(ChoiceOptionDtoCommon, [ 'orderNum' ]) {
	@ApiPropertyOptional({ type: Number, description: '신규 추가: undefined, 수정: 값 존재' })
	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	public id?: number;
}