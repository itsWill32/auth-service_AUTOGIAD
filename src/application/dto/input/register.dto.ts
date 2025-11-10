// auth-service/src/application/dto/input/register.dto.ts

import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches, 
  IsOptional,
  IsEnum
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  WORKSHOP_ADMIN = 'WORKSHOP_ADMIN',
  ADMIN = 'ADMIN'
}

export class RegisterDto {
  @ApiProperty({
    example: 'juan.perez@gmail.com',
    description: 'Email del usuario'
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña (mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número)',
    minLength: 8
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { 
      message: 'La contraseña debe contener al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial' 
    }
  )
  password: string;

  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Nombre del usuario'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Apellido del usuario'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({
    example: '+52 961 123 4567',
    description: 'Teléfono del usuario'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'El teléfono debe ser válido' })
  phone?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.CUSTOMER,
    description: 'Rol del usuario'
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}