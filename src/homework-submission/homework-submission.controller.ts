import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { HomeworkSubmissionService } from './homework-submission.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('homework-submissions')
export class HomeworkSubmissionController {
  constructor(private readonly service: HomeworkSubmissionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/homework-submissions',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        cb(null, true);
      },
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateHomeworkSubmissionDto) {
    if (!file) throw new BadRequestException('Файл не был загружен');
    const fileUrl = `/uploads/homework-submissions/${file.filename}`;

    return this.service.create(dto, fileUrl);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Get('/homework/:homeworkId')
  findByHomework(@Param('homeworkId') homeworkId: string) {
    return this.service.findByHomework(+homeworkId);
  }

  //   @Put(':id')
  //   update(@Param('id') id: string, @Body() dto: UpdateHomeworkSubmissionDto) {
  //     return this.service.update(+id, dto);
  //   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

    @Post('grade')
  async saveGrade(
    @Body()
    body: { homeworkId: number; studentId: number; grade: number },
  ) {
    const { homeworkId, studentId, grade } = body;
    return this.service.saveHomeworkGrade(homeworkId, studentId, grade);
  }
}
