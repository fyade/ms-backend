import { Module } from '@nestjs/common';
import { DeptController } from './dept.controller';
import { DeptService } from './dept.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DeptController],
  providers: [DeptService, AuthService, JwtService]
})
export class DeptModule {
}
