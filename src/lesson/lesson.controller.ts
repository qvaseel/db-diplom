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

  @Get('/get-one/:id')
  async getOneById(@Param('id') id: number) {
    return this.lessonService.findOne(Number(id));
  }

  @Get('/get-all-by-group-and-discipline')
  async getAllByParams(
    @Query('groupId') groupId: number,
    @Query('disciplineId') disciplineId: number,
  ) {
    return this.lessonService.findAllByGroupAndDiscipline(
      Number(groupId),
      Number(disciplineId),
    );
  }

  @Get('/get-all-by-date/:date')
  async getAllByDate(@Param('date') date: string) {
    const lessons = this.lessonService.findAllByDate(date);
    return lessons;
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
