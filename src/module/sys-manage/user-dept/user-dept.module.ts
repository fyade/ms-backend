import { Module } from '@nestjs/common';
import { UserDeptController } from './user-dept.controller';
import { UserDeptService } from './user-dept.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserDeptController],
  providers: [UserDeptService, AuthService, JwtService]
})
export class UserDeptModule {
}
