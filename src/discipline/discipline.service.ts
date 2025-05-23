import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';

@Injectable()
export class DisciplineService {

    constructor(private prisma: PrismaService) {}

    async create(data: CreateDisciplineDto) {
        return await this.prisma.discipline.create({ data });
    }

    async findAll() {
        return await this.prisma.discipline.findMany({ include: { teacher: true } });
    }

    async findOne(id: number) {
        return await this.prisma.discipline.findFirst({ where: { id } });
    }

    async findAllByTeacher(teacherId: number) {
        return await this.prisma.discipline.findMany({ where: { teacherId: teacherId }, include: { teacher: true }})
    }

    async update(id: number, data: CreateDisciplineDto) {
        return await this.prisma.discipline.update({ where: { id: id }, data })
    }

    async delete(id: number) {
        return await this.prisma.discipline.delete({ where: { id: id }})
    }
}
