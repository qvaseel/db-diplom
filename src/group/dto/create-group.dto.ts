import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    course: number;

    @IsNotEmpty()
    @IsNumber()
    specialityId: number;
}