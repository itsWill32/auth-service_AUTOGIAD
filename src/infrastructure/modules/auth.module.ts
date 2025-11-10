// auth-service/src/infrastructure/modules/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controllers
import { AuthController } from '../adapters/input/http/auth.controller';

// Use Cases
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';

// Domain Services
import { PasswordService } from '../../domain/services/password.service';

// Infrastructure - Repositories
import { UserRepository } from '../adapters/output/database/user.repository';

// Infrastructure - Services
import { JwtTokenService } from '../adapters/output/services/jwt-token.service';

// Infrastructure - Strategies
import { JwtStrategy } from '../adapters/input/http/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,

    // Domain Services
    PasswordService,

    // Infrastructure - Repositories
    UserRepository,

    // Infrastructure - Services
    JwtTokenService,

    // Strategies
    JwtStrategy,
  ],
  exports: [
    UserRepository,
    JwtTokenService,
    PasswordService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}