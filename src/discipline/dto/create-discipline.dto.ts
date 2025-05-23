import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDisciplineDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    teacherId: number;
}