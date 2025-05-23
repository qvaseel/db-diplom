import { IsInt, IsString, Min } from 'class-validator';

export class RedeemPointsDto {
  @IsInt()
  scheduleId: number;

  @IsString()
  date: string; // ISO строка даты

  @IsString()
  type: string;

  @IsInt()
  value: number; // Оценка (например, 5)

  @IsInt()
  @Min(1)
  pointsRequired: number;
}
