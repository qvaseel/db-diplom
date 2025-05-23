import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {

    constructor(private prisma: PrismaService) {}

    public async create(data: CreateGroupDto) {
        return await this.prisma.group.create({ data });
    }

    public async findAll() {
        return await this.prisma.group.findMany({ include: { speciality: true }});
    }

    public async update(id: number, data: CreateGroupDto) {
        return await this.prisma.group.update({ where: { id: id }, data })
    }

    public async delete(id: number) {
        return await this.prisma.group.delete({ where: { id: id }})
    }
}
