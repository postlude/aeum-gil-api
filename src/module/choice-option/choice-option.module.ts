import { Module } from '@nestjs/common';
import { ChoiceOptionController } from './choice-option.controller';
import { ChoiceOptionService } from './choice-option.service';

@Module({
	controllers: [ ChoiceOptionController ],
	providers: [ ChoiceOptionService ]
})
export class ChoiceOptionModule {}
