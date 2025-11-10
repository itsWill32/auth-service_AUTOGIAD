// auth-service/src/application/use-cases/login-user.use-case.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/input/login.dto';
import { AuthResponseDto } from '../dto/output/auth-response.dto';
import { UserRepository } from '../../infrastructure/adapters/output/database/user.repository';
import { JwtTokenService } from '../../infrastructure/adapters/output/services/jwt-token.service';
import { PasswordService } from '../../domain/services/password.service';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: JwtTokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    // 1. Buscar usuario por email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar que el usuario no esté inactivo
    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta ha sido desactivada');
    }

    // 3. Verificar contraseña
    if (!user.password) {
      throw new UnauthorizedException('Esta cuenta usa autenticación externa');
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 4. Actualizar último login
    await this.userRepository.updateLastLogin(user.id);

    // 5. Generar tokens JWT
    const tokens = this.tokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 6. Retornar respuesta
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.tokenService.getAccessTokenExpiresIn(),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }
}