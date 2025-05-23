import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';
import { PrismaModule } from 'src/prisma.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  controllers: [GradeController],
  providers: [GradeService],
  imports: [PrismaModule, TelegramModule]
  
})
export class GradeModule {}
