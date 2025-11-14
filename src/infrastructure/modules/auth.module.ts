import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '../http/controllers/auth.controller';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GoogleAuthUseCase,
  RefreshTokenUseCase,
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
  LogoutUseCase,
} from '../../application/use-cases/auth';
import { TokenService, JwtService as AppJwtService } from '../../application/services';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,

    TokenService,
    AppJwtService,

    {
      provide: RegisterUserUseCase,
      useFactory: (userRepo, refreshTokenRepo, tokenService, jwtService) => {
        return new RegisterUserUseCase(userRepo, refreshTokenRepo, tokenService, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', TokenService, AppJwtService],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepo, refreshTokenRepo, tokenService, jwtService) => {
        return new LoginUserUseCase(userRepo, refreshTokenRepo, tokenService, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', TokenService, AppJwtService],
    },
    {
      provide: GoogleAuthUseCase,
      useFactory: (userRepo, refreshTokenRepo, tokenService, jwtService) => {
        return new GoogleAuthUseCase(userRepo, refreshTokenRepo, tokenService, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', TokenService, AppJwtService],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (userRepo, refreshTokenRepo, jwtService) => {
        return new RefreshTokenUseCase(userRepo, refreshTokenRepo, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', AppJwtService],
    },
    {
      provide: RequestPasswordResetUseCase,
      useFactory: (userRepo, passwordResetRepo, tokenService) => {
        return new RequestPasswordResetUseCase(userRepo, passwordResetRepo, tokenService);
      },
      inject: ['IUserRepository', 'IPasswordResetRepository', TokenService],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (userRepo, passwordResetRepo) => {
        return new ResetPasswordUseCase(userRepo, passwordResetRepo);
      },
      inject: ['IUserRepository', 'IPasswordResetRepository'],
    },
    {
      provide: LogoutUseCase,
      useFactory: (refreshTokenRepo) => {
        return new LogoutUseCase(refreshTokenRepo);
      },
      inject: ['IRefreshTokenRepository'],
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}