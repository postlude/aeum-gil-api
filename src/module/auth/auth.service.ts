import { ConflictException, Injectable } from '@nestjs/common';
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
}
