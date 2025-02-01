import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DiscordWebhook } from 'src/config/config.model';

@Injectable()
export class DiscordService {
	constructor(
		private configService: ConfigService<DiscordWebhook>
	) {
		this.WEBHOOK_URL = this.configService.get('WEBHOOK_URL', { infer: true });
	}

	private WEBHOOK_URL: string | undefined;

	public async sendMessage(params: {
		webhookUrl?: string
		content: string
	}) {
		const { webhookUrl, content } = params;

		const url = webhookUrl || this.WEBHOOK_URL;
		if (!url) {
			throw new Error('url not defined');
		}

		await axios.post(url, { content });
	}
}