import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  exports: [PortfolioService],
  providers: [PortfolioService],
  controllers: [PortfolioController],
  imports: [PrismaModule]
})
export class PortfolioModule {}