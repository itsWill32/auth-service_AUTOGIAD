import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { UserRole as UserRoleEnum, OAuthProvider as OAuthProviderEnum } from '@prisma/client';


@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const userData = {
      id: user.getId(),
      email: user.getEmail(),
      password: user.getPasswordHash(),
      fullName: user.getFullName(),
      phone: user.getPhone(),
      avatarUrl: user.getAvatarUrl(),
      role: user.getRole() as UserRoleEnum,
      oauthProvider: user.getOAuthProvider() as OAuthProviderEnum,
      isEmailVerified: user.isVerified(),
      updatedAt: user.getUpdatedAt(),
    };

    const savedUser = await this.prisma.user.upsert({
      where: { id: user.getId() },
      update: userData,
      create: {
        ...userData,
        createdAt: user.getCreatedAt(),
      },
    });

    return this.toDomain(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByOAuthProvider(provider: string, email: Email): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email.getValue(),
        oauthProvider: provider as OAuthProviderEnum,
      },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });

    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map((user) => this.toDomain(user)),
      total,
    };
  }

  async findByRole(role: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { role: role as UserRoleEnum },
    });

    return users.map((user) => this.toDomain(user));
  }

  private toDomain(prismaUser: any): User {
    const emailVO = Email.create(prismaUser.email);
    
    let passwordVO: Password | null = null;
    if (prismaUser.password) {
      passwordVO = Password.fromHash(prismaUser.password);
    }

    if (prismaUser.oauthProvider === 'GOOGLE') {
      return User.createWithOAuth(
        prismaUser.id,
        emailVO,
        prismaUser.fullName,
        prismaUser.avatarUrl,
        prismaUser.role,
      );
    } else {
      const { UserRoleVO } = require('../../../domain/value-objects/user-role.vo');
      const { Profile } = require('../../../domain/value-objects/profile.vo');
      const { OAuthProviderVO, OAuthProvider } = require('../../../domain/value-objects/oatuh-provider.vo');
      
      const roleVO = new UserRoleVO(prismaUser.role);
      const profileVO = new Profile(
        prismaUser.fullName,
        prismaUser.phone,
        prismaUser.avatarUrl,
      );
      const oauthProviderVO = new OAuthProviderVO(OAuthProvider.EMAIL);

      return new User(
        prismaUser.id,
        emailVO,
        roleVO,
        profileVO,
        oauthProviderVO,
        passwordVO,
        prismaUser.isEmailVerified,
        prismaUser.createdAt,
        prismaUser.updatedAt,
      );
    }
  }
}