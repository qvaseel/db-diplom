import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';

@Controller('disciplines')
export class DisciplineController {

    constructor(private disciplineService: DisciplineService) {}

    @Post()
    async create(@Body() data: CreateDisciplineDto) {
        return this.disciplineService.create(data);
    }

    @Get("/by-id/:id")
    async getOneById(@Param('id') id: number) {
        return this.disciplineService.findOne(Number(id));
    }

    @Get()
    async getAll() {
        return this.disciplineService.findAll();
    }

    @Get("/by-teacher")
    async getAllByTeacher(@Query('teacherId') teacherId: number) {
        return this.disciplineService.findAllByTeacher(Number(teacherId));
    }

    @Patch('/:id')
    async updateDiscipline(@Param('id') id: number, @Body() data: CreateDisciplineDto) {
        return this.disciplineService.update(Number(id), data)
    }

    @Delete("/:id")
    async deleteDiscipline(@Param('id') id: number) {
        return this.disciplineService.delete(Number(id));
    }

}
