import { Module } from '@nestjs/common';
import { SpecialityController } from './speciality.controller';
import { SpecialityService } from './speciality.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialityController],
  providers: [SpecialityService]
})
export class SpecialityModule {}
