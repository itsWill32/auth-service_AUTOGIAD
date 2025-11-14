import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user.exceptions';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { TokenService } from '../../services/token.service';
import { JwtService } from '../../services/jwt.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    const emailVO = Email.create(dto.email);
    const existingUser = await this.userRepository.findByEmail(emailVO);

    if (existingUser) {
      throw new UserAlreadyExistsException(dto.email);
    }

    const userId = uuidv4();
    const user = await User.createWithEmailPassword(
      userId,
      emailVO,
      dto.password,
      dto.fullName,
      dto.role as any,
      dto.phone,
    );

    const savedUser = await this.userRepository.save(user);

    const refreshTokenEntity = RefreshToken.create(
      uuidv4(),
      this.tokenService.generateRefreshToken(), 
      savedUser.getId(),
    );

    const savedRefreshToken = await this.refreshTokenRepository.save(refreshTokenEntity);

    const accessToken = this.jwtService.generateAccessToken(savedUser); 

    return {
      user: UserMapper.toDto(savedUser),
      tokens: {
        accessToken,
        refreshToken: savedRefreshToken.getToken(),
        expiresIn: this.jwtService.getAccessTokenExpiresIn(), 
      },
    };
  }
}