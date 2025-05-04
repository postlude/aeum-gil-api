import { Test } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { ItemActionType } from 'src/database/entity';
import { ChapterRepository, ChoiceOptionRepository, EndingRecordRepository, EndingRepository, ItemRepository, PageRepository, PlayRecordRepository, PlayStatusRepository } from 'src/database/repository';
import { ArrayUtil } from 'src/util/array-util.service';
import { GameService } from './game.service';

describe('GameService', () => {
	let gameService: GameService;

	const mockChapterRepository = mock<ChapterRepository>();
	const mockPageRepository = mock<PageRepository>();
	const mockItemRepository = mock<ItemRepository>();
	const mockPlayRecordRepository = mock<PlayRecordRepository>();
	const mockEndingRepository = mock<EndingRepository>();
	const mockEndingRecordRepository = mock<EndingRecordRepository>();
	const mockPlayStatusRepository = mock<PlayStatusRepository>();
	const mockChoiceOptionRepository = mock<ChoiceOptionRepository>();
	const arrayUtil = new ArrayUtil();

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				GameService,
				{ provide: ChapterRepository, useValue: mockChapterRepository },
				{ provide: PageRepository, useValue: mockPageRepository },
				{ provide: ItemRepository, useValue: mockItemRepository },
				{ provide: PlayRecordRepository, useValue: mockPlayRecordRepository },
				{ provide: EndingRepository, useValue: mockEndingRepository },
				{ provide: EndingRecordRepository, useValue: mockEndingRecordRepository },
				{ provide: PlayStatusRepository, useValue: mockPlayStatusRepository },
				{ provide: ChoiceOptionRepository, useValue: mockChoiceOptionRepository },
				{ provide: ArrayUtil, useValue: arrayUtil }
			]
		}).compile();

		gameService = module.get<GameService>(GameService);
	});

	describe('Test calculateItems', () => {
		test('소유 O, 랜덤 획득 O', () => {
			const ownedItems = [
				{ itemId: 1, count: 1 }
			];
			const itemMappings = [ {
				choiceOptionId: 1,
				itemId: 1,
				actionType: ItemActionType.RandomGain,
				createdAt: new Date(),
				updatedAt: new Date()
			} ];

			const result = (gameService as any).calculateItems(ownedItems, itemMappings);
			expect(result).toStrictEqual([ { itemId: 1, count: 2 } ]);
		});

		test('소유 O, 매핑 O, 획득', () => {
			const ownedItems = [
				{ itemId: 1, count: 1 }
			];
			const itemMappings = [ {
				choiceOptionId: 1,
				itemId: 1,
				actionType: ItemActionType.Gain,
				createdAt: new Date(),
				updatedAt: new Date()
			} ];

			const result = (gameService as any).calculateItems(ownedItems, itemMappings);
			expect(result).toStrictEqual([ { itemId: 1, count: 2 } ]);
		});

		test('소유 O, 매핑 O, 소모 - 아이템이 없으면 null', () => {
			const ownedItems = [
				{ itemId: 1, count: 1 }
			];
			const itemMappings = [ {
				choiceOptionId: 1,
				itemId: 1,
				actionType: ItemActionType.Loss,
				createdAt: new Date(),
				updatedAt: new Date()
			} ];

			const result = (gameService as any).calculateItems(ownedItems, itemMappings);
			expect(result).toBeNull();
		});

		test('소유 O, 매핑 O, 소모 - 다른 아이템 있는 경우', () => {
			const ownedItems = [
				{ itemId: 1, count: 1 },
				{ itemId: 2, count: 1 }
			];
			const itemMappings = [ {
				choiceOptionId: 1,
				itemId: 1,
				actionType: ItemActionType.Loss,
				createdAt: new Date(),
				updatedAt: new Date()
			} ];

			const result = (gameService as any).calculateItems(ownedItems, itemMappings);
			expect(result).toStrictEqual([ { itemId: 2, count: 1 } ]);
		});

		test('소유 O, 매핑 X', () => {
			const ownedItems = [
				{ itemId: 1, count: 1 }
			];

			const result = (gameService as any).calculateItems(ownedItems);
			expect(result).toStrictEqual(ownedItems);
		});

		test('소유 X, 랜덤 획득 O', () => {
			const ownedItems = null;
			const itemMappings = [ {
				choiceOptionId: 1,
				itemId: 1,
				actionType: ItemActionType.RandomGain,
				createdAt: new Date(),
				updatedAt: new Date()
			} ];

			const result = (gameService as any).calculateItems(ownedItems, itemMappings);
			expect(result).toStrictEqual([ { itemId: 1, count: 1 } ]);
		});

		test('소유 X, 매핑 O - 아이템 획득인 경우', () => {
			const ownedItems = null;
			const itemMappings = [ {
				choiceOptionId: 1,
				itemId: 1,
				actionType: ItemActionType.Gain,
				createdAt: new Date(),
				updatedAt: new Date()
			} ];

			const result = (gameService as any).calculateItems(ownedItems, itemMappings);
			expect(result).toStrictEqual([ { itemId: 1, count: 1 } ]);
		});

		test('소유 X, 매핑 O - 아이템 소모인 경우', () => {
			const ownedItems = null;
			const itemMappings = [ {
				choiceOptionId: 1,
				itemId: 1,
				actionType: ItemActionType.Loss,
				createdAt: new Date(),
				updatedAt: new Date()
			} ];

			expect(() => {
				(gameService as any).calculateItems(ownedItems, itemMappings);
			}).toThrow();
		});
	});
});