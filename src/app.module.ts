import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { GroupModule } from './group/group.module';
import { SpecialityModule } from './speciality/speciality.module';
import { DisciplineModule } from './discipline/discipline.module';
import { ScheduleModule } from './schedule/schedule.module';
import { LessonModule } from './lesson/lesson.module';
import { GradeModule } from './grade/grade.module';
import { AuthModule } from './auth/auth.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TelegramModule } from './telegram/telegram.module';
import { HomeworkService } from './homework/homework.service';
import { HomeworkModule } from './homework/homework.module';
import { HomeworkSubmissionService } from './homework-submission/homework-submission.service';
import { HomeworkSubmissionModule } from './homework-submission/homework-submission.module';

@Module({
  imports: [UserModule, RoleModule, GroupModule, SpecialityModule, DisciplineModule, ScheduleModule, LessonModule, GradeModule, AuthModule, PortfolioModule, TelegramModule, HomeworkModule, HomeworkSubmissionModule],

})
export class AppModule {}
