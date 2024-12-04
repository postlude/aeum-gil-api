import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { ItemDto } from './item.dto';

@Controller('/items')
@ApiTags('Item')
export class ItemController {
	constructor(
		private readonly itemService: ItemService
	) {}

	@Get('/')
	@ApiOperation({ summary: '전체 아이템 조회', description: '선택지 편집시 사용' })
	@ApiResponse({ status: HttpStatus.OK, type: [ ItemDto ] })
	public async getAllItems() {
		return await this.itemService.getAllItems();
	}
}