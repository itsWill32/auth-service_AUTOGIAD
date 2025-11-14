import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';


@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const data = {
      id: refreshToken.getId(),
      token: refreshToken.getToken(),
      userId: refreshToken.getUserId(),
      expiresAt: refreshToken.getExpiresAt(),
      createdAt: refreshToken.getCreatedAt(),
    };

    const savedToken = await this.prisma.refreshToken.create({
      data,
    });

    return this.toDomain(savedToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) return null;

    return this.toDomain(refreshToken);
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return tokens.map((token) => this.toDomain(token));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }



  private toDomain(prismaToken: any): RefreshToken {
    return new RefreshToken(
      prismaToken.id,
      prismaToken.token,
      prismaToken.userId,
      prismaToken.expiresAt,
      prismaToken.createdAt,
    );
  }
}