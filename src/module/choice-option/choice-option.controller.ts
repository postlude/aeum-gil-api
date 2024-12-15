import { Body, Controller, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChoiceOptionService } from './choice-option.service';
import { AddChoiceOptionDto, SetChoiceOptionDto } from './choice-option.dto';

@Controller('/choice-options')
@ApiTags('ChoiceOption')
export class ChoiceOptionController {
	constructor(
		private readonly choiceOptionService: ChoiceOptionService
	) {}

	@Post('/')
	@ApiOperation({ summary: '선택지 생성' })
	@ApiResponse({ status: HttpStatus.CREATED, type: Number, description: '생성된 choiceOption.id' })
	public async addChoiceOption(
		@Body() body: AddChoiceOptionDto
	) {
		const choiceOptionId = await this.choiceOptionService.addChoiceOption(body);
		return choiceOptionId;
	}

	@Put('/:choiceOptionId')
	@ApiOperation({ summary: '선택지 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 choiceOption.id' })
	public async setChoiceOption(
		@Param('choiceOptionId', ParseIntPipe) choiceOptionId: number,
		@Body() body: SetChoiceOptionDto
	) {
		await this.choiceOptionService.setChoiceOption(body, choiceOptionId);
		return choiceOptionId;
	}
}