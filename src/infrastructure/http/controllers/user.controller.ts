import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetUserByIdUseCase } from '../../../application/use-cases/user/get-user-by-id.use-case';
import { UpdateProfileUseCase } from '../../../application/use-cases/user/update-profile.use-case';
import { VerifyEmailUseCase } from '../../../application/use-cases/user/verify-email.use-case';
import { UserDto, UpdateProfileDto } from '../../../application/dtos';


@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })

  async getCurrentUser(@Request() req: any): Promise<UserDto> {
    const userId = req.user?.id || 'mock-user-id';
    return this.getUserByIdUseCase.execute(userId);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserById(@Param('userId') userId: string): Promise<UserDto> {
    return this.getUserByIdUseCase.execute(userId);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar perfil de usuario' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado', type: UserDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })

  async updateProfile(
    @Request() req: any,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserDto> {
    const userId = req.user?.id || 'mock-user-id';
    return this.updateProfileUseCase.execute(userId, dto);
  }

  @Post('verify-email/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar email de usuario' })
  @ApiResponse({ status: 200, description: 'Email verificado exitosamente' })
  async verifyEmail(@Param('userId') userId: string): Promise<{ message: string }> {
    return this.verifyEmailUseCase.execute(userId);
  }
}