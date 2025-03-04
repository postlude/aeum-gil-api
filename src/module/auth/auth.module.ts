import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig, JwtExpiration } from 'src/config/config.model';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [ ConfigService ],
			useFactory: (configService: ConfigService<JwtConfig>) => ({
				secret: configService.get('JWT_SECRET', { infer: true }),
				signOptions: { expiresIn: JwtExpiration }
			})
		})
	],
	controllers: [ AuthController ],
	providers: [ JwtStrategy, AuthService ]
})
export class AuthModule {}
