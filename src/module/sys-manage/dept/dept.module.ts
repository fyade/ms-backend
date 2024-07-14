import { Module } from '@nestjs/common';
import { DeptController } from './dept.controller';
import { DeptService } from './dept.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [DeptController],
  providers: [DeptService, AuthService, JwtService, CachePermissionService]
})
export class DeptModule {
}
