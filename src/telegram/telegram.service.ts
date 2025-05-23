// telegram.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(private readonly prisma: PrismaService) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
  }

  async onModuleInit() {
    //this.bot.sendMessage(809071778, 'я хороший');

    this.bot.on('message', (msg) => {
      const username = msg.from?.username || msg.from?.id;
      const text = msg.text || '';
      console.log(`[Telegram] ${username}: ${text}`);
    });

    // Обработка команды /start с email
    this.bot.onText(/\/start/, async (msg) => {
      const telegramId = msg.chat.id.toString();

      const emailMatch = msg.text.match(/\/start\s+(\S+)/);
      if (!emailMatch) {
        await this.bot.sendMessage(
          telegramId,
          'Для регистрации пришлите команду вида: /start your@vuz.ru'
        );
        return;
      }

      const email = emailMatch[1];

      try {
        const user = await this.prisma.user.update({
          where: { email },
          data: { telegramId },
        });

        await this.bot.sendMessage(
          telegramId,
          `Привет, ${user.firstName}! Telegram успешно привязан ✅`
        );
      } catch (error) {
        console.error('Ошибка при обновлении Telegram ID:', error);
        await this.bot.sendMessage(
          telegramId,
          '❌ Не удалось привязать Telegram. Убедитесь, что email корректный.'
        );
      }
    });
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, message);

    } catch (error) {
      console.error('Ошибка при отправке сообщения в Telegram:', error);
    }
  }
}
