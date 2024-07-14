import { Module } from '@nestjs/common';
import { CodeGenColumnService } from './code-gen-column.service';
import { CodeGenColumnController } from './code-gen-column.controller';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [CodeGenColumnController],
  providers: [CodeGenColumnService, AuthService, JwtService, CachePermissionService],
})
export class CodeGenColumnModule {
}
