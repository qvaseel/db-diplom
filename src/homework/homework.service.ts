import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { group } from 'console';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHomeworkDto: CreateHomeworkDto, fileUrl?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: Number(createHomeworkDto.lessonId) },
      include: {
        schedule: {
          include: { group: { include: { students: true } } },
        },
      },
    });

    if (!lesson) throw new Error('Урок не найден');

    const homework = await this.prisma.homework.create({
      data: {
        ...createHomeworkDto,
        fileUrl,
      },
    });

    const students = lesson.schedule.group.students;

    await Promise.all(
      students.map((student) =>
        this.prisma.homeworkSubmission.create({
          data: {
            homeworkId: homework.id,
            studentId: student.id,
          },
        }),
      ),
    );

    return homework;
  }

  async findAll() {
    return this.prisma.homework.findMany();
  }

  async findByLesson(lessonId: number) {
    return this.prisma.homework.findUnique({
      where: { lessonId },
      include: { submissions: true },
    });
  }

  async findOne(id: number) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            student: true,
          },
        },
      },
    });
    if (!homework) throw new NotFoundException('Homework not found');
    return homework;
  }

  async update(id: number, updateDto: UpdateHomeworkDto, fileUrl?: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { id: id },
    });

    if (!homework) throw new NotFoundException('homework not found');

    if (fileUrl && homework.fileUrl) {
      const oldFilePath = join(process.cwd(), homework.fileUrl);
      try {
        await unlink(oldFilePath);
      } catch (err) {
        console.warn('Не удалось удалить старый файл:', err.message);
      }
    }

    return this.prisma.homework.update({
      where: { id },
      data: {
        ...updateDto,
        ...(fileUrl ? { fileUrl } : {}),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.homework.delete({
      where: { id },
    });
  }

  async submitHomework(
    homeworkId: number,
    studentId: number,
    file: Express.Multer.File,
  ) {
    return this.prisma.homeworkSubmission.create({
      data: {
        homeworkId,
        studentId,
        fileUrl: file.path,
      },
    });
  }
}
