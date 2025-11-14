import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user.exceptions';
import { UpdateProfileDto } from '../../dtos/user/update-profile.dto';
import { UserDto } from '../../dtos/user/user.dto';
import { UserMapper } from '../../mappers/user.mapper';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    user.updateProfile(dto.fullName, dto.phone, dto.avatarUrl);

    const updatedUser = await this.userRepository.save(user);

    return UserMapper.toDto(updatedUser); 
  }
}