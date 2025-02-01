import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DiscordService } from 'src/util/discord.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
	constructor(
		private readonly discordService: DiscordService
	) {}

	intercept(context: ExecutionContext, next: CallHandler) {
		return next
			.handle()
			.pipe(
				catchError((err) => {
					if (err instanceof HttpException) {
						const status = err.getStatus();

						if (status >= 500) {
							const { message, stack } = err;

							const stackMessage = stack ? `\n\`\`\`${stack}\`\`\`` : '';
							const content = `API Error Occured\n\n> ${message}${stackMessage}`;

							// floating
							this.discordService.sendMessage({ content });
						}
					}

					return throwError(() => err);
				})
			);
	}
}