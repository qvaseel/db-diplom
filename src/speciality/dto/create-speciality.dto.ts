import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSpecialityDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}