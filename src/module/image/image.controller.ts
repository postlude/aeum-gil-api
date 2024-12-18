import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/images')
@ApiTags('Image')
export class ImageController {
	constructor(
	) {}
}