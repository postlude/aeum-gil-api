import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/config/config.model';
import { SignInUser } from 'src/core/core.model';

interface JwtPayload {
	/** user.id */
	sub: number;

	/** user.name */
	name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService<JwtConfig>
	) {
		const secretOrKey = configService.get('JWT_SECRET', { infer: true });
		if (!secretOrKey) {
			throw new Error('JWT_SECRET is not defined');
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey
		});
	}

	public validate(payload: JwtPayload): SignInUser {
		const { sub, name } = payload;
		return { userId: sub, name };
	}
}