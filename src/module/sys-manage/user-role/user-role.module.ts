import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService, AuthService, JwtService],
})
export class UserRoleModule {
}
