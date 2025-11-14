import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import {
  InvalidCredentialsException,
  UserNotFoundException,
} from '../../../domain/exceptions/user.exceptions';
import { LoginDto } from '../../dtos/auth/login.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { TokenService } from '../../services/token.service';
import { JwtService } from '../../services/jwt.service';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const emailVO = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(emailVO);

    if (!user) {
      throw new UserNotFoundException(dto.email);
    }

    const isPasswordValid = await user.verifyPassword(dto.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
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
}