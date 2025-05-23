import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedule')
export class ScheduleController {

    constructor(private scheduleService: ScheduleService) {}

    @Post()
    async create(@Body() data: CreateScheduleDto) {
        return this.scheduleService.create(data)
    }

    @Get()
    async getAll() {
        return this.scheduleService.findAll();
    }

    @Get('/group/:groupId')
    async getOneByGroup(@Param('groupId') groupId: number) {
        return this.scheduleService.findOneByGroup(Number(groupId));
    }

    @Get('/teacher/:teacherId')
    async getOneByTeacher(@Param('teacherId') teacherId: number) {
        return this.scheduleService.findOneByTeacher(Number(teacherId));
    }

    @Get('/group-and-discipline')
    async getByGroupAndDiscipline(@Query('groupId') groupId: number, @Query('disciplineId') disciplineId: number) {
        return this.scheduleService.findAllByGroupAndDiscipline(Number(groupId), Number(disciplineId));
    }

    @Put('/:id')
    async update(@Param('id') id: number, @Body() data: CreateScheduleDto) {
        return this.scheduleService.update(Number(id), data);
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        return this.scheduleService.delete(Number(id));
    }

}
