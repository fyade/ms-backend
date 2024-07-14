import { Module } from '@nestjs/common';
import { CodeGenTableController } from './code-gen-table.controller';
import { CodeGenTableService } from './code-gen-table.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [CodeGenTableController],
  providers: [CodeGenTableService, AuthService, JwtService, CachePermissionService],
})
export class CodeGenTableModule {
}
