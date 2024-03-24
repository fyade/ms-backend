import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, AuthService, JwtService],
})
export class PermissionModule {
}
