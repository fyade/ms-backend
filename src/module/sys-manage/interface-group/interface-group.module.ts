import { Module } from '@nestjs/common';
import { InterfaceGroupController } from './interface-group.controller';
import { InterfaceGroupService } from './interface-group.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [InterfaceGroupController],
  providers: [InterfaceGroupService, AuthService, JwtService, CachePermissionService],
})
export class InterfaceGroupModule {
}
