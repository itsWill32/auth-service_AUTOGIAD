import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  PrismaUserRepository,
  PrismaRefreshTokenRepository,
  PrismaPasswordResetRepository,
} from '../database/repositories';


@Global()
@Module({
  providers: [
    PrismaService,
    
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: 'IPasswordResetRepository',
      useClass: PrismaPasswordResetRepository,
    },
  ],
  exports: [
    PrismaService,
    'IUserRepository',
    'IRefreshTokenRepository',
    'IPasswordResetRepository',
  ],
})
export class DatabaseModule {}