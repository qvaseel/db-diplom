import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [LessonController],
  providers: [LessonService],
  imports: [PrismaModule]
})
export class LessonModule {}
