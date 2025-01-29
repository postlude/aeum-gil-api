import { Injectable } from '@nestjs/common';
import { EndingRepository } from 'src/database/repository/ending.repository';

@Injectable()
export class EndingService {
	constructor(
		private readonly endingRepository: EndingRepository
	) {}
}
