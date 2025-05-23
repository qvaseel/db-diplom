import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Post()
  async create(@Body() data: CreateLessonDto) {
    console.log(data)
    return this.lessonService.create(data);
  }

  @Get('/:id')
  async getOneById(@Param('id') id: number) {
    return this.lessonService.findOne(Number(id));
  }

  @Get()
  async getAllByParams(
    @Query('groupId') groupId: number,
    @Query('disciplineId') disciplineId: number,
  ) {
    return this.lessonService.findAllByGroupAndDiscipline(
      Number(groupId),
      Number(disciplineId),
    );
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: Partial<CreateLessonDto>) {
    return this.lessonService.update(Number(id), data);
  }

  @Delete('/:id')
  async deleteLesson(@Param('id') id: number) {
    return this.lessonService.delete(Number(id))
  }
}
