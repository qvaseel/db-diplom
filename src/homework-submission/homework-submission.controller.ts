import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
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
  async create(@Body() dto: CreateHomeworkSubmissionDto) {
    return this.service.create(dto);
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
    return this.service.findByHomework(Number(homeworkId));
  }

  @Patch('student/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/homeworks-submissions',
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
  update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const fileUrl = file ? `/uploads/homeworks-submissions/${file.filename}` : undefined;
        return this.service.update(
      Number(id),
      fileUrl,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Patch('grade')
  async saveGrade(
    @Body()
    body: {
      dto: CreateHomeworkSubmissionDto;
      grade: number;
    },
  ) {
    const { dto, grade } = body;
    return this.service.saveHomeworkGrade(dto, grade);
  }
}
