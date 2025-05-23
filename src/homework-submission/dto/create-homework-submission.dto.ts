import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateHomeworkSubmissionDto {
  @IsNotEmpty()
  @IsNumber()
  homeworkId: number;
  
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsString()
  comment?: string;
}
