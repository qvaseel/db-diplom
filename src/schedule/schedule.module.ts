import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [PrismaModule]
})
export class ScheduleModule {}
