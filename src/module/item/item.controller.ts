import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemService } from './item.service';

@Controller('/items')
@ApiTags('Item')
export class ItemController {
	constructor(
		private readonly itemService: ItemService
	) {}
}