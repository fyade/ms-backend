import { Module } from '@nestjs/common';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';
import { AuthService } from '../../sys-manage/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserGroupController],
  providers: [UserGroupService, AuthService, JwtService]
})
export class UserGroupModule {
}
