import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateLessonDto {

    @IsNumber()
    scheduleId: number;

    @IsString()
    date: string;

    @IsString()
    topic: string;

    @IsString()
    typeOfLesson: string;
}