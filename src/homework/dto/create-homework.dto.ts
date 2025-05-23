import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHomeworkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  dueDate: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lessonId: number;
}