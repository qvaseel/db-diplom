import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoleService {

    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.RoleCreateInput): Promise<Role> {
        return this.prisma.role.create({
            data,
        })
    }

    async getAll() {
        return this.prisma.role.findMany();
    }

    async getRoleByValue(value: string) {
        const role = await this.prisma.role.findFirst({ where: {value}});
        return role;
    }
    
    async getRoleById(id: number) {
        const role = await this.prisma.role.findUnique({ where: { id }})
        return [role.value];
    }

}
