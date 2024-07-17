import { Module } from '@nestjs/common';
import { AlgorithmV1Controller } from './algorithm-v1.controller';
import { AlgorithmV1Service } from './algorithm-v1.service';
import { AuthService } from '../auth/auth.service';
import { CachePermissionService } from '../cache/cache.permission.service';

@Module({
  controllers: [AlgorithmV1Controller],
  providers: [AlgorithmV1Service, AuthService, CachePermissionService],
})
export class AlgorithmV1Module {
}
