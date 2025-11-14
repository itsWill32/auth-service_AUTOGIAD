import { Module } from '@nestjs/common';
import { UserController } from '../http/controllers/user.controller';
import {
  GetUserByIdUseCase,
  UpdateProfileUseCase,
  VerifyEmailUseCase,
} from '../../application/use-cases/user';


@Module({
  controllers: [UserController],
  providers: [
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepo) => {
        return new GetUserByIdUseCase(userRepo);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: UpdateProfileUseCase,
      useFactory: (userRepo) => {
        return new UpdateProfileUseCase(userRepo);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: VerifyEmailUseCase,
      useFactory: (userRepo) => {
        return new VerifyEmailUseCase(userRepo);
      },
      inject: ['IUserRepository'],
    },
  ],
})
export class UserModule {}