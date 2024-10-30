import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class PageDto {
	@ValidateIf((_o, value) => value !== null)
	@IsString()
	@IsNotEmpty()
	@Expose()
	public description: string | null;

	@IsString()
	@IsNotEmpty()
	@Expose()
	public content: string;
}