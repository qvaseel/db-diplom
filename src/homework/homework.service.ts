import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto'
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

async create(createHomeworkDto: CreateHomeworkDto, fileUrl: string) {
    return this.prisma.homework.create({
      data: {
        ...createHomeworkDto,
        fileUrl
      },
    });
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

  async update(id: number, updateDto: UpdateHomeworkDto) {
    return this.prisma.homework.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    return this.prisma.homework.delete({
      where: { id },
    });
  }

  async submitHomework(homeworkId: number, studentId: number, file: Express.Multer.File) {
    return this.prisma.homeworkSubmission.create({
      data: {
        homeworkId,
        studentId,
        fileUrl: file.path,
      },
    });
  }

  
}
