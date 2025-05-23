import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';

@Controller('grades')
export class GradeController {

    constructor(private gradeService: GradeService) {}

    @Post()
    async create(@Body() data: CreateGradeDto) {
        return this.gradeService.create(data);
    }

    @Get('by-student-and-discipline')
    async getAllByStudentAndDiscipline(@Query('studentId') studentId: number, @Query('disciplineId') disciplineId: number) {
        return this.gradeService.findAllByStudentAndDiscipline(Number(studentId), Number(disciplineId));
    }

    @Get('by-student')
    async getAllByStudent(@Query('studentId') studentId: number) {
        return this.gradeService.findAllByStudent(Number(studentId));
    }

    @Get('by-group-and-discipline')
    async getAllByGroupAndDiscipline(@Query('groupId') groupId: number, @Query('disciplineId') disciplineId: number) {
        return this.gradeService.findAllByGroupAndDiscipline(Number(groupId), Number(disciplineId));
    }

    @Get("/:studentId")
    async getManyByStudent(@Param('studentId') studentId: number) {
        return this.gradeService.findOne(studentId)
    }

    @Patch('/:id')
    async update(@Param('id') id: number, @Body() data: Partial<CreateGradeDto>) {
      return this.gradeService.update(Number(id), data);
    }
}
