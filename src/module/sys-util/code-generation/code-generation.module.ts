import { Module } from '@nestjs/common';
import { CodeGenerationController } from './code-generation.controller';
import { CodeGenerationService } from './code-generation.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Module({
  controllers: [CodeGenerationController],
  providers: [CodeGenerationService, AuthService, JwtService, CachePermissionService]
})
export class CodeGenerationModule {}
