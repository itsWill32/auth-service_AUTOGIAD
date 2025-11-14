import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TokenService {

  generateRefreshToken(): string {
    return uuidv4() + uuidv4();
  }


  generatePasswordResetToken(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }


  generateEmailVerificationToken(): string {
    return uuidv4();
  }


  generateTemporaryToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}