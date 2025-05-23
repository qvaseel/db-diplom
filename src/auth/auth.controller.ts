import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authSevice: AuthService) {}

    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authSevice.login(userDto);
    }

    @Post('/reg')
    registration(@Body() userDto: CreateUserDto) {
        return this.authSevice.registration(userDto);
    }

}
