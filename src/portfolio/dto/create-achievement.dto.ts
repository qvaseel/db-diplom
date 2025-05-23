import { IsString, IsInt, Min } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;
}
