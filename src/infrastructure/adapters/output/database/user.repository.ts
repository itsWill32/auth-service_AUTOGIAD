// auth-service/src/infrastructure/adapters/output/database/user.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { User } from '../../../../domain/entities/user.entity';

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}

@Injectable()
export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateUserData): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role ? (data.role as UserRole) : UserRole.CUSTOMER,
        isVerified: false, // Por defecto no verificado
        isActive: true,
      },
    });

    return new User(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return prismaUser ? new User(prismaUser) : null;
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return prismaUser ? new User(prismaUser) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { googleId },
    });

    return prismaUser ? new User(prismaUser) : null;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}