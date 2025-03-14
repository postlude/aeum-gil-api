import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest } from './core.model';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<CustomRequest>();
	return request.user;
});