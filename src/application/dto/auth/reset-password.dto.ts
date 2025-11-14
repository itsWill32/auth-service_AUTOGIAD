import { IsString, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'Email del usuario que solicita reset',
    example: 'juan.perez@gmail.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}


export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de recuperación recibido por email',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña (mínimo 8 caracteres)',
    example: 'NuevaPassword456!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}