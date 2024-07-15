import { Module } from '@nestjs/common';
import { UserUserGroupController } from './user-user-group.controller';
import { UserUserGroupService } from './user-user-group.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [UserUserGroupController],
  providers: [UserUserGroupService, AuthService, JwtService, CachePermissionService],
})
export class UserUserGroupModule {
}
