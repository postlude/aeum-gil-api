import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPresignedUrlRequest } from './file.dto';
import { FileService } from './file.service';
import { AdminOnly } from '../../core/admin-only.guard';

@Controller('/files')
@UseGuards(AdminOnly)
@ApiTags('File')
@ApiBearerAuth()
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