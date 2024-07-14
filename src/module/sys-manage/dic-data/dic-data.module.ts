import { Module } from '@nestjs/common';
import { DicDataController } from './dic-data.controller';
import { DicDataService } from './dic-data.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [DicDataController],
  providers: [DicDataService, AuthService, JwtService, CachePermissionService],
})
export class DicDataModule {
}
