import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface';
import { RefreshTokenNotFoundException } from '../../../domain/exceptions/refresh-token.exceptions';


@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<{ message: string }> {
    const token = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!token) {
      throw new RefreshTokenNotFoundException(refreshToken);
    }

    await this.refreshTokenRepository.delete(token.getId());

    return {
      message: 'Logout exitoso',
    };
  }
}