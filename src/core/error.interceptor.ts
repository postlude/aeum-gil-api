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
					const shouldNotify = err instanceof HttpException
						? err.getStatus() >= 500
						: err instanceof Error;

					if (shouldNotify) {
						const { message, stack } = err;
						const stackMessage = stack ? `\n\`\`\`${stack}\`\`\`` : '';
						const content = `API Error Occured\n\n> ${message}${stackMessage}`;

						// floating
						this.discordService.sendMessage({ content });
					}

					return throwError(() => err);
				})
			);
	}
}