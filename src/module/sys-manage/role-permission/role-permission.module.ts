import { Module } from '@nestjs/common';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RolePermissionController],
  providers: [RolePermissionService, AuthService, JwtService],
})
export class RolePermissionModule {
}
