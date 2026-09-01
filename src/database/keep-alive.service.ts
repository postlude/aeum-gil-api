import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserRepository } from './repository';

@Injectable()
export class KeepAliveService {
	private readonly logger = new Logger(KeepAliveService.name);

	constructor(private readonly userRepository: UserRepository) {}

	@Cron(CronExpression.EVERY_6_HOURS)
	public async ping() {
		await this.userRepository.find({ take: 1 });
		this.logger.log('Supabase keep-alive query executed');
	}
}
