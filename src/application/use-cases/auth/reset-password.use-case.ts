import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IPasswordResetRepository } from '../../../domain/repositories/password-reset.repository.interface';
import {
  PasswordResetTokenNotFoundException,
  PasswordResetTokenExpiredException,
  PasswordResetTokenAlreadyUsedException,
} from '../../../domain/exceptions/password-reset.exceptions';
import { UserNotFoundException } from '../../../domain/exceptions/user.exceptions';
import { ResetPasswordDto } from '../../dtos/auth/reset-password.dto';


@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetRepository: IPasswordResetRepository,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<{ message: string }> {
    const passwordReset = await this.passwordResetRepository.findByToken(dto.token);

    if (!passwordReset) {
      throw new PasswordResetTokenNotFoundException();
    }

    if (passwordReset.isExpired()) {
      throw new PasswordResetTokenExpiredException();
    }

    if (passwordReset.isUsed()) {
      throw new PasswordResetTokenAlreadyUsedException();
    }

    const user = await this.userRepository.findById(passwordReset.getUserId());

    if (!user) {
      throw new UserNotFoundException(passwordReset.getUserId());
    }

    await user.changePassword(dto.newPassword);

    await this.userRepository.save(user);

    passwordReset.markAsUsed();
    await this.passwordResetRepository.markAsUsed(passwordReset.getId());



    return {
      message: 'Contraseña restablecida exitosamente',
    };
  }
}