import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { RoleService } from 'src/role/role.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService, private roleService: RoleService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.findByEmail(userDto.email);

        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.create({...userDto, password: hashPassword});
        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const role = await this.roleService.getRoleById(user.roleId);
        const payload = { email: user.email, id: user.id, roles: role }
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.findByEmail(userDto.email);
    
        if (!user) {
            throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
        }
    
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    
        if (!passwordEquals) {
            throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
        }
    
        return user;
    }
}
