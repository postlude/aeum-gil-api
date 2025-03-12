import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { FetchItemDto, SaveItemDto } from './item.dto';
import { AdminOnly } from '../../core/admin-only.guard';

@Controller('/items')
@UseGuards(AdminOnly)
@ApiTags('Item')
@ApiBearerAuth()
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
		const itemId = await this.itemService.saveItem(body);
		return itemId;
	}

	@Put('/:itemId')
	@ApiOperation({ summary: '아이템 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 item.id' })
	public async setItem(
		@Param('itemId', ParseIntPipe) itemId: number,
		@Body() body: SaveItemDto
	) {
		await this.itemService.saveItem(body, itemId);
		return itemId;
	}

	@Delete('/:itemId')
	@ApiOperation({ summary: '아이템 삭제' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '삭제된 item.id' })
	public async removeItem(
		@Param('itemId', ParseIntPipe) itemId: number
	) {
		await this.itemService.removeItem(itemId);
		return itemId;
	}
}