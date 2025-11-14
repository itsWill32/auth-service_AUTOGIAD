import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class UserDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  fullName: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['VEHICLE_OWNER', 'WORKSHOP_ADMIN', 'SYSTEM_ADMIN'],
    example: 'VEHICLE_OWNER',
  })
  role: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '+52 961 123 4567',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL del avatar',
    example: 'https://cdn.autodiag.com/avatars/user123.jpg',
  })
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Proveedor OAuth si aplica',
    enum: ['GOOGLE', 'EMAIL'],
    example: 'EMAIL',
  })
  oauthProvider?: string;

  @ApiProperty({
    description: 'Si el email está verificado',
    example: false,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-11-14T05:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-11-14T05:00:00.000Z',
  })
  updatedAt: Date;
}