import { Module } from '@nestjs/common';
import { LogUserLoginController } from './log-user-login.controller';
import { LogUserLoginService } from './log-user-login.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [LogUserLoginController],
  providers: [LogUserLoginService, AuthService, JwtService, CachePermissionService],
})
export class LogUserLoginModule {
}
