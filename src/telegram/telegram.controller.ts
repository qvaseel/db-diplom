import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // подставь свой guard
import { TelegramLinkDto } from './dto/telegram-link.dto';


@Controller('telegram')
export class TelegramController {

}
