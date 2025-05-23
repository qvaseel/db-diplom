import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { TelegramService } from 'src/telegram/telegram.service';
import { scheduled } from 'rxjs';

@Injectable()
export class GradeService {
  constructor(
    private prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async create(data: CreateGradeDto) {
    const grade = await this.prisma.grade.create({
      data,
      include: {
        student: { include: { group: true } },
        lesson: {
          include: {
            schedule: { include: { discipline: true, teacher: true } },
          },
        },
      },
    });

    await this.sendTelegramNotification(grade);

    return grade;
  }

  async findAll() {
    return await this.prisma.grade.findMany();
  }

  async findOne(studentId: number) {
    return await this.prisma.grade.findFirst({ where: { studentId } });
  }

  public async findAllByStudentAndDiscipline(
    studentId: number,
    disciplineId: number,
  ) {
    return await this.prisma.grade.findMany({
      where: {
        studentId: studentId,
        lesson: { schedule: { disciplineId: disciplineId } },
      },
      include: { lesson: true, student: true },
    });
  }

  public async findAllByGroupAndDiscipline(
    groupId: number,
    disciplineId: number,
  ) {
    return await this.prisma.grade.findMany({
      where: {
        lesson: { schedule: { groupId: groupId, disciplineId: disciplineId } },
      },
      include: { lesson: true, student: true },
    });
  }

  public async findAllByStudent(studentId: number) {
    return await this.prisma.grade.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        lesson: { include: { schedule: { include: { discipline: true } } } },
        student: true,
      },
    });
  }

  public async update(id: number, data: Partial<CreateGradeDto>) {
    const grade = await this.prisma.grade.update({
      where: { id },
      data,
      include: {
        student: {
          include: { group: true },
        },
        lesson: {
          include: {
            schedule: {
              include: {
                discipline: true,
                teacher: true,
              },
            },
          },
        },
      },
    });

    await this.sendTelegramNotification(grade);

    return grade;
  }

  private async sendTelegramNotification(grade: any) {
    const { student, lesson, grade: gradeValue, comment } = grade;
    const telegramId = student.telegramId;

    if (!telegramId) return;

    const discipline = lesson.schedule.discipline.name;
    const teacher =
      lesson.schedule.teacher.firstName +
      ' ' +
      lesson.schedule.teacher.lastName;
    const topic = lesson.topic || 'Не указано';
    const date = lesson.date || 'Не указано';
    const type = lesson.typeOfLesson || 'Не указано';
    
    const message = `📢 Вам выставлена новая оценка по дисциплина: ${discipline}\n👨‍🏫 Преподаватель: ${teacher}\n🎯 За "${type}" по теме: ${topic}\n📝 Комментарий: ${comment ?? '—'}\n💯 Оценка: ${gradeValue ?? 'не указана'}\n📅 Дата: ${date ?? 'не указана'}`;

    await this.telegramService.sendMessage(telegramId, message);
  }
}
