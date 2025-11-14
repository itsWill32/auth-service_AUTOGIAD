import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GetUserByIdUseCase } from '../../../application/use-cases/user/get-user-by-id.use-case';
import { UpdateProfileUseCase } from '../../../application/use-cases/user/update-profile.use-case';
import { VerifyEmailUseCase } from '../../../application/use-cases/user/verify-email.use-case';
import { UserDto, UpdateProfileDto } from '../../../application/dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';


@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener usuario actual (requiere autenticación)' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getCurrentUser(@CurrentUser() user: any): Promise<UserDto> {
    return this.getUserByIdUseCase.execute(user.id);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener usuario por ID (público)' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  async getUserById(@Param('userId') userId: string): Promise<UserDto> {
    return this.getUserByIdUseCase.execute(userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar perfil de usuario (requiere autenticación)' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado', type: UserDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserDto> {
    return this.updateProfileUseCase.execute(user.id, dto);
  }

  @Post(':userId/verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar email de usuario' })
  @ApiResponse({ status: 200, description: 'Email verificado exitosamente' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  async verifyEmail(@Param('userId') userId: string): Promise<{ message: string }> {
    return this.verifyEmailUseCase.execute(userId);
  }
}