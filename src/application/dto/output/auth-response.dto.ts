// auth-service/src/application/dto/output/auth-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  isVerified: boolean;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token de refresco',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer'
  })
  tokenType: string;

  @ApiProperty({
    description: 'Tiempo de expiración en segundos',
    example: 900
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Datos del usuario autenticado',
    type: UserDataDto
  })
  user: UserDataDto;
}