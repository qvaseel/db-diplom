import { IsString, IsNotEmpty } from 'class-validator';

export class TelegramLinkDto {
  @IsString()
  @IsNotEmpty()
  hash: string;

  [key: string]: any; // другие поля Telegram (id, username и т.д.)
}
