import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ExistUserBodyDto } from 'src/auth/dto/exist-user-body.dto';
import { GetUserDto } from './dto/get-user.dto';
import { RoleService } from 'src/role/role.service';
import { AddRoleDto } from './dto/add-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PortfolioService } from 'src/portfolio/portfolio.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: PrismaService,
    private roleService: RoleService,
    private portfolioService: PortfolioService,
  ) {}

  public async create(data: CreateUserDto) {
    const user = await this.userRepository.user.create({ data });
    const portfolio = await this.portfolioService.createPortfolio({
               
            userId: user.id,
            category: "Портфолио", // добавляем category
        
    });
    const portfolioId = portfolio.id;

    await this.userRepository.user.update({
      where: { id: user.id },
      data: { portfolioId },
    });

    return user;
  }

  public async findByEmail(email: string) {
    return await this.userRepository.user.findUnique({
      where: { email },
      include: {
        role: true,
        grades: true,
        group: true,
        disciplines: true,
        schedule: true,
        portfolio: true,
      },
    });
  }

  public async findById(id: number) {
    return await this.userRepository.user.findFirst({
      where: { id },
      include: {
        role: true,
        grades: true,
        group: true,
        disciplines: true,
        schedule: true,
      },
    });
  }

  public async existUserByEmail(
    data: ExistUserBodyDto,
  ): Promise<GetUserDto | null> {
    return this.userRepository.user.findUnique({
      where: { email: data.email },
    });
  }

  public async findAll() {
    return this.userRepository.user.findMany({
      include: {
        role: true,
        grades: true,
        group: true,
        disciplines: true,
        schedule: true,
      },
    });
  }

  public async findAllStudents() {
    return this.userRepository.user.findMany({
      where: { role: { value: 'STUDENT' } },
      include: {
        role: true,
        grades: true,
        group: true,
        schedule: true,
        portfolio: true,
      },
    });
  }

  public async findAllStudentsByGroup(groupId: number) {
    return this.userRepository.user.findMany({
      where: { group: { id: groupId } },
      include: {
        role: true,
        grades: true,
        group: true,
        schedule: true,
      },
    });
  }

  public async findAllTeachers() {
    return this.userRepository.user.findMany({
      where: { role: { value: 'TEACHER' } },
      include: {
        role: true,
        disciplines: true,
        schedule: true,
      },
    });
  }

  public async addRole(data: AddRoleDto) {
    const user = await this.userRepository.user.findUnique({
      where: { id: data.userId },
    });
    const role = await this.roleService.getRoleByValue(data.value);

    if (!user || !role) {
      throw new HttpException(
        'Пользователь или роль не найдены',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.userRepository.user.update({
      where: { id: user.id },
      data: { roleId: role.id },
    });
  }

  public async delete(id: number) {
    return await this.userRepository.user.delete({ where: { id: id } });
  }

  public async update(id: number, data: UpdateUserDto) {
    return await this.userRepository.user.update({
      where: { id },
      data,
    });
  }

  public async searchUsers(query: string, take = 5, skip = 0) {
  return this.userRepository.user.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
      
    },
    include: {
      role: true
    },
    take,
    skip,
  });
  }
}
