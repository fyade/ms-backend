import { Module } from '@nestjs/common';
import { InterfaceInterfaceGroupController } from './interface-interface-group.controller';
import { InterfaceInterfaceGroupService } from './interface-interface-group.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [InterfaceInterfaceGroupController],
  providers: [InterfaceInterfaceGroupService, AuthService, JwtService, CachePermissionService],
})
export class InterfaceInterfaceGroupModule {
}
