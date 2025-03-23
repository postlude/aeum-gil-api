import { Injectable } from '@nestjs/common';
import { random } from 'lodash';

@Injectable()
export class ArrayUtil {
	public pickRandom<T>(array: T[]) {
		const randomIndex = random(0, array.length - 1);
		return array[randomIndex];
	}
}