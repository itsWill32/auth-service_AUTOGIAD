import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email único del usuario',
    example: 'juan.perez@gmail.com',
  })
  @IsEmail({}, { message: 'El email debe ser una dirección de correo electrónico válida' })
  email: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 8 caracteres)',
    example: 'MiPassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3, { message: 'El nombre completo debe tener al menos 3 caracteres' })
  fullName: string;

  @ApiPropertyOptional({
    description: 'Teléfono en formato +52 XXX XXX XXXX',
    example: '+52 961 123 4567',
    pattern: '^\\+52 \\d{3} \\d{3} \\d{4}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+52 \d{3} \d{3} \d{4}$/, {
    message: 'Phone must be in format +52 XXX XXX XXXX',
  })
  phone?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['VEHICLE_OWNER', 'WORKSHOP_ADMIN', 'SYSTEM_ADMIN'],
    example: 'VEHICLE_OWNER',
  })
  @IsEnum(['VEHICLE_OWNER', 'WORKSHOP_ADMIN', 'SYSTEM_ADMIN'], {
    message: 'Role must be a valid user role',
  })
  role: string;
}