import { IsEmail } from "class-validator";

export class ExistUserBodyDto {
	@IsEmail()
	email: string;
}