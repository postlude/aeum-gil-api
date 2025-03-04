import { Body, Controller, Delete, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChoiceOptionService } from './choice-option.service';
import { AddChoiceOptionBody, AddChoiceOptionItemBody, ReorderChoiceOptionsBody, ReorderChoiceOptionsResponse, SetChoiceOptionBody, SetChoiceOptionItemBody } from './choice-option.dto';
import { AdminOnly } from '../auth/jwt/admin-only.guard';

@Controller('/choice-options')
@UseGuards(AdminOnly)
@ApiTags('ChoiceOption')
@ApiBearerAuth()
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

	@Post('/:choiceOptionId/items')
	@ApiOperation({ summary: '선택지 아이템 추가' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '추가한 아이템 id' })
	public async addChoiceOptionItem(
		@Param('choiceOptionId', ParseIntPipe) choiceOptionId: number,
		@Body() body: AddChoiceOptionItemBody
	) {
		return await this.choiceOptionService.addChoiceOptionItem(choiceOptionId, body);
	}

	@Put('/:choiceOptionId/items/:itemId')
	@ApiOperation({ summary: '선택지 아이템 수정' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '수정한 아이템 id' })
	public async setChoiceOptionItem(
		@Param('itemId', ParseIntPipe) itemId: number,
		@Param('choiceOptionId', ParseIntPipe) choiceOptionId: number,
		@Body() { actionType }: SetChoiceOptionItemBody
	) {
		await this.choiceOptionService.setChoiceOptionItem(choiceOptionId, itemId, actionType);
		return itemId;
	}

	@Delete('/:choiceOptionId/items/:itemId')
	@ApiOperation({ summary: '선택지 아이템 삭제' })
	@ApiResponse({ status: HttpStatus.OK, type: Number, description: '삭제한 아이템 id' })
	public async removeChoiceOptionItem(
		@Param('itemId', ParseIntPipe) itemId: number,
		@Param('choiceOptionId', ParseIntPipe) choiceOptionId: number
	) {
		await this.choiceOptionService.removeChoiceOptionItem(choiceOptionId, itemId);
		return itemId;
	}
}