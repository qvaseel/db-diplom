import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupController {

    constructor(private groupService: GroupService) {}

    @Post()
    async create(@Body() data: CreateGroupDto) {
        return this.groupService.create(data);
    }

    @Get()
    async getAll() {
        return this.groupService.findAll();
    }

    @Patch('/:id')
    async updateGroup(@Param('id') id: number, @Body() data: CreateGroupDto) {
        return this.groupService.update(Number(id), data);
    }

    @Delete('/:id')
    async deleteGroup(@Param('id') id: number) {
        return this.groupService.delete(Number(id))
    }
}
