import { Module } from '@nestjs/common';
import { DicTypeController } from './dic-type.controller';
import { DicTypeService } from './dic-type.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [DicTypeController],
  providers: [DicTypeService, AuthService, JwtService, CachePermissionService],
})
export class DicTypeModule {
}
