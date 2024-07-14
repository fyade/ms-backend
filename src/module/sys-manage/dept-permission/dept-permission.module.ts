import { Module } from '@nestjs/common';
import { DeptPermissionController } from './dept-permission.controller';
import { DeptPermissionService } from './dept-permission.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [DeptPermissionController],
  providers: [DeptPermissionService, AuthService, JwtService, CachePermissionService]
})
export class DeptPermissionModule {
}
