import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto';

@Injectable()
export class HomeworkSubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateHomeworkSubmissionDto, fileUrl: string) {
    return this.prisma.homeworkSubmission.create({ data: { ...data, fileUrl } });
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

//   async update(id: number, data: UpdateHomeworkSubmissionDto) {
//     return this.prisma.homeworkSubmission.update({
//       where: { id },
//       data,
//     });
//   }

  async remove(id: number) {
    return this.prisma.homeworkSubmission.delete({
      where: { id },
    });
  }

    async saveHomeworkGrade(homeworkId: number, studentId: number, gradeValue: number) {
    // Найти существующий HomeworkSubmission
    const submission = await this.prisma.homeworkSubmission.findFirst({
      where: { homeworkId, studentId },
      include: { homework: true }, // чтобы получить lessonId
    });

    if (!submission) {
      throw new NotFoundException('Домашняя работа от студента не найдена.');
    }

    // Проверить, есть ли уже оценка для этой сдачи
    const existingGrade = await this.prisma.grade.findFirst({
      where: { homeworkSubmissionId: submission.id },
    });

    if (existingGrade) {
      return this.prisma.grade.update({
        where: { id: existingGrade.id },
        data: { grade: gradeValue },
      });
    }

    // Создать оценку, если её ещё нет
    return this.prisma.grade.create({
      data: {
        studentId,
        lessonId: submission.homework.lessonId,
        homeworkSubmissionId: submission.id,
        grade: gradeValue,
        attend: true,
        comment: '',
      },
    });
  }
}
