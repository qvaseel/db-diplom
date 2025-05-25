
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateHomeworkDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lessonId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  dueDate: string;
}