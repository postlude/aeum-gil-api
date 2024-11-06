import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class PageDto {
	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	public prevPageId?: number | null;

	@Expose()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	public description?: string | null;

	@Expose()
	@IsString()
	@IsNotEmpty()
	public content: string;
}