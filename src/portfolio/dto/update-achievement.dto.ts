import { IsString, IsInt, Min } from 'class-validator';

export class UpdateAchievementDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;
}
