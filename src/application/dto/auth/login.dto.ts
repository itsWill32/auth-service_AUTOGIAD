import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@gmail.com',
  })
  @IsEmail({}, { message: 'El email debe ser una dirección de correo electrónico válida' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiPassword123!',
  })
  @IsString()
  password: string;
}