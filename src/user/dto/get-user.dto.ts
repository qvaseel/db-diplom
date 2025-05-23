import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class GetUserDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsEmail()
	email: string;
}