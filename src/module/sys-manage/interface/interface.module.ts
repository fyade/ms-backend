import { Module } from '@nestjs/common';
import { InterfaceController } from './interface.controller';
import { InterfaceService } from './interface.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [InterfaceController],
  providers: [InterfaceService, AuthService, JwtService, CachePermissionService],
})
export class InterfaceModule {
}
