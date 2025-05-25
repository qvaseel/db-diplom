import { Module } from '@nestjs/common';
import { HomeworkSubmissionController } from './homework-submission.controller';
import { PrismaModule } from 'src/prisma.module';
import { HomeworkSubmissionService } from './homework-submission.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  controllers: [HomeworkSubmissionController],
  providers: [HomeworkSubmissionService],
  imports: [PrismaModule, TelegramModule],
})
export class HomeworkSubmissionModule {}
