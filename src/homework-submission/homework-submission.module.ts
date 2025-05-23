import { Module } from '@nestjs/common';
import { HomeworkSubmissionController } from './homework-submission.controller';
import { PrismaModule } from 'src/prisma.module';
import { HomeworkSubmissionService } from './homework-submission.service';

@Module({
  controllers: [HomeworkSubmissionController],
  providers: [HomeworkSubmissionService],
  imports: [PrismaModule],
})
export class HomeworkSubmissionModule {}
