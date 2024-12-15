import { Body, Controller, Delete, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChoiceOptionService } from './choice-option.service';
import { AddChoiceOptionBody, ReorderChoiceOptionsBody, ReorderChoiceOptionsResponse, SetChoiceOptionBody } from './choice-option.dto';

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
		@Body() body: AddChoiceOptionBody
	) {
		const choiceOptionId = await this.choiceOptionService.addChoiceOption(body);
		return choiceOptionId;
	}

	@Put('/reorder')
	@ApiOperation({ summary: '선택지 순서 변경' })
	@ApiResponse({ status: HttpStatus.OK, type: ReorderChoiceOptionsResponse, description: '정렬한 선택지 id 배열' })
	public async reorderChoiceOptions(
		@Body() { choiceOptionIds }: ReorderChoiceOptionsBody
	) {
		return await this.choiceOptionService.reorderChoiceOptions(choiceOptionIds);
	}

	@Put('/:choiceOptionId')
	@ApiOperation({ summary: '선택지 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정된 choiceOption.id' })
	public async setChoiceOption(
		@Param('choiceOptionId', ParseIntPipe) choiceOptionId: number,
		@Body() body: SetChoiceOptionBody
	) {
		await this.choiceOptionService.setChoiceOption(body, choiceOptionId);
		return choiceOptionId;
	}

	@Delete('/:choiceOptionId')
	@ApiOperation({ summary: '선택지 삭제' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '삭제된 choiceOption.id' })
	public async removeChoiceOption(
		@Param('choiceOptionId', ParseIntPipe) choiceOptionId: number
	) {
		await this.choiceOptionService.removeChoiceOption(choiceOptionId);
		return choiceOptionId;
	}
}