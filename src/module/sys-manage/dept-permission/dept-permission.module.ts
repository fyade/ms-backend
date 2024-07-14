import { Module } from '@nestjs/common';
import { DeptPermissionController } from './dept-permission.controller';
import { DeptPermissionService } from './dept-permission.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DeptPermissionController],
  providers: [DeptPermissionService, AuthService, JwtService]
})
export class DeptPermissionModule {
}
