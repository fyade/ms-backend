import { Module } from '@nestjs/common';
import { UserLoginController } from './user-login.controller';
import { UserLoginService } from './user-login.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserLoginController],
  providers: [UserLoginService, AuthService, JwtService],
})
export class UserLoginModule {
}
