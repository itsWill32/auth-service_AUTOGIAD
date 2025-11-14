import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { GoogleAuthDto } from '../../dtos/auth/google-auth.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { TokenService } from '../../services/token.service';
import { JwtService } from '../../services/jwt.service';

@Injectable()
export class GoogleAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: GoogleAuthDto): Promise<AuthResponseDto> {
    const googleUserData = await this.validateGoogleCode(dto.code);

    const emailVO = Email.create(googleUserData.email);
    let user = await this.userRepository.findByOAuthProvider('GOOGLE', emailVO);

    if (!user) {
      const userId = uuidv4();
      user = User.createWithOAuth(
        userId,
        emailVO,
        googleUserData.name,
        googleUserData.picture,
      );

      user = await this.userRepository.save(user);
    }

    const refreshTokenEntity = RefreshToken.create(
      uuidv4(),
      this.tokenService.generateRefreshToken(),
      user.getId(),
    );

    const savedRefreshToken = await this.refreshTokenRepository.save(refreshTokenEntity);

    const accessToken = this.jwtService.generateAccessToken(user);

    return {
      user: UserMapper.toDto(user),
      tokens: {
        accessToken,
        refreshToken: savedRefreshToken.getToken(),
        expiresIn: this.jwtService.getAccessTokenExpiresIn(),
      },
    };
  }

  private async validateGoogleCode(code: string): Promise<{
    email: string;
    name: string;
    picture?: string;
  }> {
    return {
      email: 'user@gmail.com',
      name: 'John Doe',
      picture: 'https://example.com/avatar.jpg',
    };
  }
}