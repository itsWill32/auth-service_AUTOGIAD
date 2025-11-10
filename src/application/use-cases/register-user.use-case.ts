// auth-service/src/application/use-cases/register-user.use-case.ts

import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../dto/input/register.dto';
import { AuthResponseDto } from '../dto/output/auth-response.dto';
import { UserRepository } from '../../infrastructure/adapters/output/database/user.repository';
import { JwtTokenService } from '../../infrastructure/adapters/output/services/jwt-token.service';
import { PasswordService } from '../../domain/services/password.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: JwtTokenService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    // 1. Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // 2. Validar fortaleza de contraseña
    const passwordValidation = this.passwordService.validate(dto.password);
    if (!passwordValidation.valid) {
      throw new BadRequestException(passwordValidation.errors);
    }

    // 3. Hashear contraseña
    const hashedPassword = await this.passwordService.hash(dto.password);

    // 4. Crear usuario en la base de datos
    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role || 'CUSTOMER',
    });

    // 5. Generar tokens JWT
    const tokens = this.tokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 6. Retornar respuesta
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.tokenService.getAccessTokenExpiresIn(),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }
}