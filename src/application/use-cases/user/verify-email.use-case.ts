import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user.exceptions';

@Injectable()
export class VerifyEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    user.verifyEmail();

    await this.userRepository.save(user);

    return {
      message: 'Email verificado exitosamente',
    };
  }
}