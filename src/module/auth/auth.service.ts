import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PlayStatusRepository } from 'src/database/repository/play-status.repository';
import { UserRepository } from 'src/database/repository/user.repository';
import { InitialGameStatus } from '../game/game.model';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly playStatusRepository: PlayStatusRepository,
		private readonly jwtService: JwtService
	) {}

	public async signUp(name: string, password: string) {
		const count = await this.userRepository.countBy({ name });
		if (count) {
			throw new ConflictException('이미 존재하는 이름입니다.');
		}

		const encrypted = await argon2.hash(password);

		const userId = await this.progressSignUp(name, encrypted);

		return await this.getJwtToken(userId, name);
	}

	@Transactional()
	private async progressSignUp(name: string, encryptedPassword: string) {
		const { identifiers } = await this.userRepository.insert({
			name,
			password: encryptedPassword
		});

		const userId = identifiers[0].id as number;

		await this.playStatusRepository.insert({
			userId,
			gameStatus: InitialGameStatus
		});

		return userId;
	}

	public async signIn(name: string, inputPassword: string) {
		const user = await this.userRepository.findOneBy({ name });
		if (!user) {
			throw new UnauthorizedException('존재하지 않는 이름이거나 비밀번호가 일치하지 않습니다.');
		}

		const { id, password } = user;

		const isValid = await argon2.verify(password, inputPassword);
		if (!isValid) {
			throw new UnauthorizedException('존재하지 않는 이름이거나 비밀번호가 일치하지 않습니다.');
		}

		return await this.getJwtToken(id, name);
	}

	private async getJwtToken(userId: number, name: string) {
		return await this.jwtService.signAsync({
			sub: userId,
			name
		});
	}
}
