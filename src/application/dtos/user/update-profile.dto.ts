import { IsString, IsOptional, MinLength, Matches, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre completo',
    example: 'Juan Pérez Gómez',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Teléfono en formato +52 XXX XXX XXXX',
    example: '+52 961 999 8888',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+52 \d{3} \d{3} \d{4}$/, {
    message: 'El teléfono debe tener el formato +52 XXX XXX XXXX',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL del avatar',
    example: 'https://cdn.autodiag.com/avatars/user123.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del avatar debe ser una URL válida' })
  avatarUrl?: string;
}