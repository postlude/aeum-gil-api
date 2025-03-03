import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/database/repository/user.repository';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository
	) {}

	public async signUp(name: string, password: string) {
		const count = await this.userRepository.countBy({ name });
		if (count) {
			throw new ConflictException('이미 존재하는 이름입니다.');
		}

		const encrypted = await argon2.hash(password);

		const { identifiers } = await this.userRepository.insert({
			name,
			password: encrypted
		});

		return identifiers[0].id as number;
	}

	public async signIn(name: string, password: string) {
		const user = await this.userRepository.findOneBy({ name });
		if (!user) {
			throw new UnauthorizedException('존재하지 않는 이름이거나 비밀번호가 일치하지 않습니다.');
		}

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) {
			throw new UnauthorizedException('존재하지 않는 이름이거나 비밀번호가 일치하지 않습니다.');
		}

		return user.id;
	}
}
