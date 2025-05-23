import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';

@Controller('specialities')
export class SpecialityController {

    constructor(private specialitiesService: SpecialityService) {}

    @Post()
    create(@Body() data: CreateSpecialityDto) {
        return this.specialitiesService.create(data)
    }

    @Get(':id')
    getOneById(@Param('id') id: number) {
        return this.specialitiesService.findOneById(id);
    }

    @Get()
    getAll() {
        return this.specialitiesService.findAll();
    }
}
