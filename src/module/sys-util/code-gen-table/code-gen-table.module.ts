import { Module } from '@nestjs/common';
import { CodeGenTableController } from './code-gen-table.controller';
import { CodeGenTableService } from './code-gen-table.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CodeGenTableController],
  providers: [CodeGenTableService, AuthService, JwtService]
})
export class CodeGenTableModule {}
