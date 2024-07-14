import { Module } from '@nestjs/common';
import { UserDeptController } from './user-dept.controller';
import { UserDeptService } from './user-dept.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [UserDeptController],
  providers: [UserDeptService, AuthService, JwtService, CachePermissionService]
})
export class UserDeptModule {
}
