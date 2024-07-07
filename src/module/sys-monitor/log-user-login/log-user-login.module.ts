import { Module } from '@nestjs/common';
import { LogUserLoginController } from './log-user-login.controller';
import { LogUserLoginService } from './log-user-login.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LogUserLoginController],
  providers: [LogUserLoginService, AuthService, JwtService],
})
export class LogUserLoginModule {
}
