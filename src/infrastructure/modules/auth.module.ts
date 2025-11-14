import { Module } from '@nestjs/common';
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
import { TokenService, JwtService } from '../../application/services';


@Module({
  controllers: [AuthController],
  providers: [
    TokenService,
    JwtService,

    {
      provide: RegisterUserUseCase,
      useFactory: (userRepo, refreshTokenRepo, tokenService, jwtService) => {
        return new RegisterUserUseCase(userRepo, refreshTokenRepo, tokenService, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', TokenService, JwtService],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepo, refreshTokenRepo, tokenService, jwtService) => {
        return new LoginUserUseCase(userRepo, refreshTokenRepo, tokenService, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', TokenService, JwtService],
    },
    {
      provide: GoogleAuthUseCase,
      useFactory: (userRepo, refreshTokenRepo, tokenService, jwtService) => {
        return new GoogleAuthUseCase(userRepo, refreshTokenRepo, tokenService, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', TokenService, JwtService],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (userRepo, refreshTokenRepo, jwtService) => {
        return new RefreshTokenUseCase(userRepo, refreshTokenRepo, jwtService);
      },
      inject: ['IUserRepository', 'IRefreshTokenRepository', JwtService],
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
})
export class AuthModule {}