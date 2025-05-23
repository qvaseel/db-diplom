import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from '@prisma/client';

@Controller('roles')
export class RoleController {

    constructor(private roleService: RoleService) {}

    @Post()
    async createRole(@Body() data: { value: string,  description: string }): Promise<Role> {
        return this.roleService.create(data);
    }

    @Get()
    async getAllRoles() {
        return this.roleService.getAll();
    }

    @Get('/:value')
    getOneByValue(@Param('value') value: string) {
      return this.roleService.getRoleByValue(value);
    }
}
