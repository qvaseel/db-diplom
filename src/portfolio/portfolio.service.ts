import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async createPortfolio(data: CreatePortfolioDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      include: { portfolio: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const newPortfolio = await this.prisma.portfolio.create({
       data: {
            user: { connect: { id: data.userId } },
            category: "Портфолио",
        },
    });

    const portfolioId = newPortfolio.id;

    // обновляем пользователя
    await this.prisma.user.update({
      where: { id: data.userId },
      data: { portfolioId },
    });

    return newPortfolio;
  }

  async createAchievement(
    userId: number,
    dto: CreateAchievementDto,
    fileUrl: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { portfolio: true },
    });

    if (!user) throw new NotFoundException('User not found');

    let portfolioId = user.portfolio?.id;

    const achievement = await this.prisma.achievement.create({
      data: {
        ...dto,
        fileUrl,
        portfolio: { connect: { id: portfolioId } },
      },
    });

    return achievement;
  }

  async getPortfolio(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: {
          include: {
            achievements: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.portfolio;
  }

  async deleteAchievement(achievementId: number) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
      include: { portfolio: true },
    });
    if (!achievement) throw new NotFoundException('Achievement not found');

    return this.prisma.achievement.delete({ where: { id: achievementId } });
  }

  async getOneAchievement(achievementId: number) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
      include: { portfolio: true },
    });
    if (!achievement) throw new NotFoundException('Achievement not found');

    return this.prisma.achievement.findUnique({ where: { id: achievementId } });
  }

  async updateAchievement(
    achievementId: number,
    dto: UpdateAchievementDto,
    fileUrl?: string,
  ) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) throw new NotFoundException('Achievement not found');

    // Если пришёл новый файл, удаляем старый
    if (fileUrl && achievement.fileUrl) {
      const oldFilePath = join(process.cwd(), achievement.fileUrl);
      try {
        await unlink(oldFilePath);
      } catch (err) {
        console.warn('Не удалось удалить старый файл:', err.message);
      }
    }

    return this.prisma.achievement.update({
      where: { id: achievementId },
      data: {
        ...dto,
        ...(fileUrl ? { fileUrl } : {}),
      },
    });
  }

  async markAsPassed(id: number) {
    const achievement = await this.prisma.achievement.update({
      where: { id },
      data: { passed: true },
    });
    return achievement;
  }
}
