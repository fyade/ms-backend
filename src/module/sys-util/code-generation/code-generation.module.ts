import { Module } from '@nestjs/common';
import { CodeGenerationController } from './code-generation.controller';
import { CodeGenerationService } from './code-generation.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CodeGenerationController],
  providers: [CodeGenerationService, AuthService, JwtService]
})
export class CodeGenerationModule {}
