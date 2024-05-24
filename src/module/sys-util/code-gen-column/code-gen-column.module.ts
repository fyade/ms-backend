import { Module } from '@nestjs/common';
import { CodeGenColumnService } from './code-gen-column.service';
import { CodeGenColumnController } from './code-gen-column.controller';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CodeGenColumnService, AuthService, JwtService],
  controllers: [CodeGenColumnController]
})
export class CodeGenColumnModule {}
