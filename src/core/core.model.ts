import { Request } from 'express';

export class SignInUser {
	public userId: number;
	public name: string;
}

export interface CustomRequest extends Request {
	user: SignInUser;
}