import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface';
import {
  RefreshTokenNotFoundException,
  RefreshTokenExpiredException,
} from '../../../domain/exceptions/refresh-token.exceptions';
import { UserNotFoundException } from '../../../domain/exceptions/user.exceptions';
import { RefreshTokenDto } from '../../dtos/auth/refresh-token.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { JwtService } from '../../services/jwt.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const refreshToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);

    if (!refreshToken) {
      throw new RefreshTokenNotFoundException(dto.refreshToken);
    }

    if (refreshToken.isExpired()) {
      throw new RefreshTokenExpiredException(refreshToken.getId());
    }

    const user = await this.userRepository.findById(refreshToken.getUserId());

    if (!user) {
      throw new UserNotFoundException(refreshToken.getUserId());
    }

    const accessToken = this.jwtService.generateAccessToken(user);

    return {
      user: UserMapper.toDto(user),
      tokens: {
        accessToken,
        refreshToken: refreshToken.getToken(),
        expiresIn: this.jwtService.getAccessTokenExpiresIn(),
      },
    };
  }
}