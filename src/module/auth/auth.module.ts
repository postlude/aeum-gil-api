import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig, JwtExpiration } from 'src/config/config.model';

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ ConfigService ],
			useFactory: (configService: ConfigService<JwtConfig>) => ({
				secret: configService.get('JWT_SECRET', { infer: true }),
				signOptions: { expiresIn: JwtExpiration }
			})
		})
	],
	controllers: [ AuthController ],
	providers: [ AuthService ]
})
export class AuthModule {}
