import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLessonDto {
    @IsNotEmpty()
    @IsNumber()
    scheduleId: number;

    @IsNotEmpty()
    @IsString()
    date: string;

    @IsString()
    topic: string;

    @IsString()
    typeOfLesson: string;
}