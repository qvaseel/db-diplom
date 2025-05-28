import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class HomeworkSubmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async create(data: CreateHomeworkSubmissionDto) {
    return this.prisma.homeworkSubmission.create({ data: { ...data } });
  }

  async findAll() {
    return this.prisma.homeworkSubmission.findMany({
      include: {
        homework: true,
        student: true,
        grade: true,
      },
    });
  }

  async findByHomework(homeworkId: number) {
    return this.prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: { student: true, grade: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.homeworkSubmission.findUnique({
      where: { id },
      include: { homework: true, student: true, grade: true },
    });
  }

  async update(id: number, fileUrl?: string) {
    const homeworkSubmission = await this.prisma.homeworkSubmission.findUnique({
      where: { id: id },
    });

    if (!homeworkSubmission)
      throw new NotFoundException('homeworkSubmission not found');

    if (fileUrl && homeworkSubmission.fileUrl) {
      const oldFilePath = join(process.cwd(), homeworkSubmission.fileUrl);
      try {
        await unlink(oldFilePath);
      } catch (err) {
        console.warn('Не удалось удалить старый файл:', err.message);
      }
    }

    return this.prisma.homeworkSubmission.update({
      where: { id },
      data: {
        ...(fileUrl ? { fileUrl } : {}),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.homeworkSubmission.delete({
      where: { id },
    });
  }

  async saveHomeworkGrade(
    dto: CreateHomeworkSubmissionDto,
    gradeValue: number,
  ) {
    // Найти существующую сдачу домашнего задания
    const submission = await this.prisma.homeworkSubmission.findFirst({
      where: { homeworkId: dto.homeworkId, studentId: dto.studentId },
      include: { homework: true },
    });

    if (!submission) {
      throw new NotFoundException('Домашняя работа от студента не найдена.');
    }

    // Проверить, есть ли уже оценка
    const existingGrade = await this.prisma.grade.findFirst({
      where: { homeworkSubmissionId: submission.id },
    });

    if (existingGrade) {
      const updatedGrade = await this.prisma.grade.update({
        where: { id: existingGrade.id },
        data: {
          grade: gradeValue,
          comment: dto.comment ?? '',
        },
        include: {
          student: true,
          lesson: {
            include: {
              schedule: {
                include: {
                  teacher: true,
                  discipline: true,
                },
              },
            },
          },
        },
      });

      await this.sendTelegramNotification(updatedGrade);
      return updatedGrade;
    }

    // Создать новую оценку
    const grade = await this.prisma.grade.create({
      data: {
        studentId: dto.studentId,
        homeworkSubmissionId: submission.id,
        lessonId: submission.homework.lessonId,
        grade: gradeValue,
        comment: dto.comment ?? '',
        attend: true,
      },
      include: {
        student: true,
        lesson: {
          include: {
            schedule: {
              include: {
                teacher: true,
                discipline: true,
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
      lesson.schedule.teacher.patronymic +
      ' ' +
      lesson.schedule.teacher.lastName;
    const date = new Date(lesson.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) || 'не указано';

    const message = `📢 Вам выставлена оценка за домашнее задание по дисциплине: ${discipline}\n👨‍🏫 Преподаватель: ${teacher} \n📝 Комментарий: ${comment ?? '—'}\n💯 Оценка: ${gradeValue ?? 'не указана'}\n📅 Дата: ${date ?? 'не указана'}`;

    await this.telegramService.sendMessage(telegramId, message);
  }
}
