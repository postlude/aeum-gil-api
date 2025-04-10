import { ApiProperty } from '@nestjs/swagger';
import { ImageType } from './file.model';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetPresignedUrlRequest {
	@ApiProperty({ type: String, description: '확장자를 포함한 파일명. 현재는 이미지만 가능하므로 jpg, jpeg, png, gif만 가능' })
	@IsString()
	@IsNotEmpty()
	@Matches(/\.(jpg|jpeg|png|gif)$/)
	public fileName: string;

	@ApiProperty({ enum: ImageType, description: 'page | item | chapter | object | ending' })
	@IsEnum(ImageType)
	public imageType: ImageType;
}