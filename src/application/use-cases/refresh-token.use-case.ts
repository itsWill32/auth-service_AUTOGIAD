// auth-service/src/application/use-cases/refresh-token.use-case.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dto/input/refresh-token.dto';
import { AuthResponseDto } from '../dto/output/auth-response.dto';
import { UserRepository } from '../../infrastructure/adapters/output/database/user.repository';
import { JwtTokenService } from '../../infrastructure/adapters/output/services/jwt-token.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: JwtTokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    // 1. Verificar y decodificar el refresh token
    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);

    // 2. Buscar usuario
    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    // 3. Generar nuevo par de tokens
    const tokens = this.tokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Retornar respuesta con nuevos tokens
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