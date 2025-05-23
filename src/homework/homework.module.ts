import { Module } from '@nestjs/common';
import { HomeworkController } from './homework.controller';
import { PrismaModule } from 'src/prisma.module';
import { HomeworkService } from './homework.service';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService],
  imports: [PrismaModule],
})
export class HomeworkModule {}
