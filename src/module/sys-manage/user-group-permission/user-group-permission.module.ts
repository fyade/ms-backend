import { Module } from '@nestjs/common';
import { UserGroupPermissionController } from './user-group-permission.controller';
import { UserGroupPermissionService } from './user-group-permission.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [UserGroupPermissionController],
  providers: [UserGroupPermissionService, AuthService, JwtService, CachePermissionService],
})
export class UserGroupPermissionModule {
}
