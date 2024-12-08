import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { FetchItemDto, SaveItemDto } from './item.dto';

@Controller('/items')
@ApiTags('Item')
export class ItemController {
	constructor(
		private readonly itemService: ItemService
	) {}

	@Get('/')
	@ApiOperation({ summary: '전체 아이템 조회' })
	@ApiResponse({ status: HttpStatus.OK, type: [ FetchItemDto ] })
	public async getAllItems() {
		return await this.itemService.getAllItems();
	}

	@Post('/')
	@ApiOperation({ summary: '아이템 신규 추가' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '생성된 item.id' })
	public async addItem(
		@Body() body: SaveItemDto
	) {
		const itemId = await this.itemService.addItem(body);
		return itemId;
	}
}