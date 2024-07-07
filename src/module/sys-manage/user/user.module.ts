import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginController } from './user-login.controller';
import { LogUserLoginService } from '../../sys-monitor/log-user-login/log-user-login.service';

@Module({
  controllers: [UserController, UserLoginController],
  providers: [UserService, AuthService, JwtService, LogUserLoginService],
})
export class UserModule {
}
