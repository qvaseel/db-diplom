import { IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  userId: number;

  @IsString()
  category: string;
}
