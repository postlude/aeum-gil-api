import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndingService } from './ending.service';

@Controller('/endings')
@ApiTags('Ending')
export class EndingController {
	constructor(
		private readonly endingService: EndingService
	) {}
}