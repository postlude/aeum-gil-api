import { OmitType } from '@nestjs/swagger';
import { FetchItemDto } from '../item/item.dto';

export class GameItem extends OmitType(FetchItemDto, [ 'importance' ]) {}