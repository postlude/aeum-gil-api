import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EndingService } from './ending.service';
import { SaveEndingBody } from './ending.dto';

@Controller('/endings')
@ApiTags('Ending')
export class EndingController {
	constructor(
		private readonly endingService: EndingService
	) {}

	@Post('/')
	@ApiOperation({ summary: '엔딩 생성' })
	@ApiResponse({ status: HttpStatus.CREATED, type: Number, description: '생성된 ending.id' })
	public async addEnding(
		@Body() body: SaveEndingBody
	) {
		const endingId = await this.endingService.saveEnding(body);
		return endingId;
	}
}