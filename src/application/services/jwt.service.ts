import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../domain/entities/user.entity';


@Injectable()
export class JwtService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET') || 'default-secret-key';
    this.JWT_EXPIRES_IN = this.configService.get<string>('JWT_EXPIRES_IN') || '15m';
  }

  generateAccessToken(user: User): string {
    const payload = {
      sub: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
      fullName: user.getFullName(),
    };

    return this.nestJwtService.sign(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }


  validateToken(token: string): { sub: string; email: string; role: string; fullName: string } | null {
    try {
      return this.nestJwtService.verify(token, {
        secret: this.JWT_SECRET,
      });
    } catch (error) {
      return null;
    }
  }


  decodeToken(token: string): any {
    return this.nestJwtService.decode(token);
  }


  getAccessTokenExpiresIn(): number {
    const expires = this.JWT_EXPIRES_IN;
    if (expires.endsWith('m')) {
      return parseInt(expires) * 60;
    }
    if (expires.endsWith('h')) {
      return parseInt(expires) * 3600;
    }
    if (expires.endsWith('d')) {
      return parseInt(expires) * 86400;
    }
    return 900; 
  }
}