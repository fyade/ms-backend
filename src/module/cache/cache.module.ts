import { Global, Module } from '@nestjs/common';
import { CachePermissionService } from './cache.permission.service';

@Global()
@Module({
  providers: [CachePermissionService],
  exports: [CachePermissionService],
})
export class CacheModule {
}