import { Body, Controller, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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

	@Put('/:endingId')
	@ApiOperation({ summary: '엔딩 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 ending.id' })
	public async setEnding(
		@Param('endingId', ParseIntPipe) endingId: number,
		@Body() body: SaveEndingBody
	) {
		await this.endingService.saveEnding(body, endingId);
		return endingId;
	}
}