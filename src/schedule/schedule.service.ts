import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduleService {

    constructor(private prisma: PrismaService) {}

    async create(data: CreateScheduleDto) {
        return await this.prisma.schedule.create({ data });
    }

    async findAll() {
        return await this.prisma.schedule.findMany({ include: {group: true, discipline: true, teacher: true}});
    }

    async findOneByGroup(groupId: number) {
        return await this.prisma.schedule.findMany({
            where: { groupId },
            include: { group: true, discipline: true, teacher: true }
        });
    }

    async findOneByTeacher(teacherId: number) {
        return await this.prisma.schedule.findMany({
            where: { teacherId },
            include: { group: true, discipline: true, teacher: true }
        });
    }

    async findAllByGroupAndDiscipline(groupId: number, disciplineId: number) {
        return await this.prisma.schedule.findMany({
            where: { groupId: groupId, disciplineId: disciplineId },
            include: { group: true, discipline: true, teacher: true }
        })
    }

    async update(id: number, data: CreateScheduleDto) {
        return await this.prisma.schedule.update({
            where: { id },
            data,
        });
    }
    
    async delete(id: number) {
        return await this.prisma.schedule.delete({
            where: { id },
        });
    }    

}
