import { User } from '../../domain/entities/user.entity';
import { UserDto } from '../dtos/user/user.dto';


export class UserMapper {

  static toDto(user: User): UserDto {
    return {
      id: user.getId(),
      email: user.getEmail(),
      fullName: user.getFullName(),
      role: user.getRole(),
      phone: user.getPhone(),
      avatarUrl: user.getAvatarUrl(),
      oauthProvider: user.getOAuthProvider(),
      isEmailVerified: user.isVerified(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }


  static toDtoList(users: User[]): UserDto[] {
    return users.map((user) => this.toDto(user));
  }
}