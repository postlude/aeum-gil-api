import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/core/core.model';

@Injectable()
export class AdminOnly extends AuthGuard('jwt') implements CanActivate {
	async canActivate(context: ExecutionContext) {
		// JWT 인증 수행
		const isAuthenticated = await super.canActivate(context);
		if (!isAuthenticated) {
			return false;
		}

		const request = context.switchToHttp().getRequest<CustomRequest>();
		const user = request.user;

		return user.name === 'admin';
	}
}
