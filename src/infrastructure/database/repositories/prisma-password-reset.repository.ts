import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IPasswordResetRepository } from '../../../domain/repositories/password-reset.repository.interface';
import { PasswordReset } from '../../../domain/entities/password-reset.entity';


@Injectable()
export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(passwordReset: PasswordReset): Promise<PasswordReset> {
    const data = {
      id: passwordReset.getId(),
      token: passwordReset.getToken(),
      userId: passwordReset.getUserId(),
      expiresAt: passwordReset.getExpiresAt(),
      used: passwordReset.isUsed(),
      createdAt: passwordReset.getCreatedAt(),
    };

    const saved = await this.prisma.passwordReset.create({
      data,
    });

    return this.toDomain(saved);
  }

  async findByToken(token: string): Promise<PasswordReset | null> {
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!passwordReset) return null;

    return this.toDomain(passwordReset);
  }

  async findByUserId(userId: string): Promise<PasswordReset[]> {
    const resets = await this.prisma.passwordReset.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return resets.map((reset) => this.toDomain(reset));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.passwordReset.delete({
      where: { id },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.passwordReset.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredOrUsed(): Promise<number> {
    const result = await this.prisma.passwordReset.deleteMany({
      where: {
        OR: [
          { used: true },
          {
            expiresAt: {
              lt: new Date(),
            },
          },
        ],
      },
    });

    return result.count;
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.passwordReset.update({
      where: { id },
      data: { used: true },
    });
  }


  private toDomain(prismaReset: any): PasswordReset {
    return new PasswordReset(
      prismaReset.id,
      prismaReset.token,
      prismaReset.userId,
      prismaReset.expiresAt,
      prismaReset.used,
      prismaReset.createdAt,
    );
  }
}