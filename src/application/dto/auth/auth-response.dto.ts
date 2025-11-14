import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';


export class TokensDto {
  @ApiProperty({
    description: 'JWT access token (15 min)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token (7 días)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Segundos hasta expiración del access token',
    example: 900,
  })
  expiresIn: number;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty({
    description: 'Tokens de acceso',
    type: TokensDto,
  })
  tokens: TokensDto;
}