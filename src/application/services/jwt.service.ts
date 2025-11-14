import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';


@Injectable()
export class JwtService {

  generateAccessToken(user: User): string {
    const payload = {
      sub: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    };

    return `mock-jwt-token-${user.getId()}-${Date.now()}`;
  }


  validateToken(token: string): { sub: string; email: string; role: string } | null {
    if (token.startsWith('mock-jwt-token-')) {
      return {
        sub: 'mock-user-id',
        email: 'mock@email.com',
        role: 'VEHICLE_OWNER',
      };
    }
    return null;
  }

  getAccessTokenExpiresIn(): number {
    return 900; 
  }
}