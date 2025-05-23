import { IsBoolean } from "class-validator";

export class ExistUserDto {
    @IsBoolean()
    success: boolean;
}