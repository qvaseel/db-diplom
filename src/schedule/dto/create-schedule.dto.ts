import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateScheduleDto {
    @IsNotEmpty()
    @IsNumber()
    groupId: number;

    @IsNotEmpty()
    @IsNumber()
    disciplineId: number;

    @IsNotEmpty()
    @IsNumber()
    teacherId: number;

    @IsNotEmpty()
    @IsNumber()
    dayOfWeek: number;

    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsNumber()
    orderNumber: number;
}