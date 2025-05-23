import {
  UseInterceptors,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('homeworks')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/homeworks',
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
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createHomeworkDto: CreateHomeworkDto,
  ) {
    if (!file) throw new BadRequestException('Файл не был загружен');

    const fileUrl = `/uploads/homeworks/${file.filename}`;
    const lessonId = Number(createHomeworkDto.lessonId);

    
  return this.homeworkService.create(
    {
      ...createHomeworkDto,
      lessonId,
    },
    fileUrl,
  );
  }

  @Get()
  findAll() {
    return this.homeworkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(+id);
  }

  @Get('/lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.homeworkService.findByLesson(Number(lessonId));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHomeworkDto) {
    return this.homeworkService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(+id);
  }

  
}
