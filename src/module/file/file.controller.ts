import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPresignedUrlRequest } from './file.dto';
import { FileService } from './file.service';

@Controller('/files')
@ApiTags('File')
export class FileController {
	constructor(
		private readonly fileService: FileService
	) {}

	@Get('/presigned-url')
	@ApiOperation({ summary: 's3 업로드를 위한 presigned url 획득', description: '' })
	@ApiResponse({ status: HttpStatus.OK, type: String })
	public async getPresignedUrl(
		@Query() { fileName, imageType }: GetPresignedUrlRequest
	) {
		return await this.fileService.getPresignedUrl(fileName, imageType);
	}
}