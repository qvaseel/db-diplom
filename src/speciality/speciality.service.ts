import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';

@Injectable()
export class SpecialityService {

    constructor(private prisma: PrismaService) {}

    public async create(data: CreateSpecialityDto) {
        return await this.prisma.speciality.create({ data });
    }

    public async findAll() {
        return await this.prisma.speciality.findMany();
    }

    public async findOneById(id: number) {
        return await this.prisma.speciality.findFirst({ where: { id } });
    }
}
