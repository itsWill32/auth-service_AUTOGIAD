import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IPasswordResetRepository } from '../../../domain/repositories/password-reset.repository.interface';
import { PasswordReset } from '../../../domain/entities/password-reset.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { RequestPasswordResetDto } from '../../dtos/auth/reset-password.dto';
import { TokenService } from '../../services/token.service';

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetRepository: IPasswordResetRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RequestPasswordResetDto): Promise<{ message: string }> {
    const emailVO = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(emailVO);

    if (user) {
      await this.passwordResetRepository.deleteByUserId(user.getId());

      const resetToken = this.tokenService.generatePasswordResetToken(); 
      const passwordResetEntity = PasswordReset.create(
        uuidv4(),
        resetToken,
        user.getId(),
      );

      await this.passwordResetRepository.save(passwordResetEntity);

      console.log(`[PASSWORD RESET] Token for ${user.getEmail()}: ${resetToken}`);
    }

    return {
      message: 'Si el email existe, recibirás instrucciones de recuperación',
    };
  }
}