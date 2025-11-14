import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class GoogleAuthDto {
  @ApiProperty({
    description: 'Authorization code de Google OAuth',
    example: '4/0AY0e-g7X...',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Redirect URI usado en la autorización',
    example: 'https://app.autodiag.com/auth/callback',
  })
  @IsUrl({}, { message: 'El Redirect URI debe ser una URL válida' })
  redirectUri: string;
}