import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { AddRoleDto } from './dto/add-role.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.create(data);
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @UseGuards(RolesGuard)
  @Get('/search-user/:id')
  getOneUserById(@Param('id') id: number) {
    return this.userService.findById(Number(id));
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @UseGuards(RolesGuard)
  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() data: AddRoleDto) {
    return this.userService.addRole(data);
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @UseGuards(RolesGuard)
  @Get('/get/students')
  getStudents() {
    return this.userService.findAllStudents();
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @UseGuards(RolesGuard)
  @Get('/get/students/:groupId')
  getStudentsByGroup(@Param('groupId') groupId: number) {
    return this.userService.findAllStudentsByGroup(Number(groupId));
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @UseGuards(RolesGuard)
  @Get('/get/teachers')
  getTeachers() {
    return this.userService.findAllTeachers();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch('/:id')
  updateUser(@Body() data: UpdateUserDto, @Param('id') id: number) {
    return this.userService.update(Number(id), data);
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @UseGuards(RolesGuard)
  @Get('/search-users')
  searchUsers(
    @Query('query') query: string,
    @Query('take') take: string = '5',
    @Query('skip') skip: string = '0',
  ) {
    return this.userService.searchUsers(query, Number(take), Number(skip));
  }
}
