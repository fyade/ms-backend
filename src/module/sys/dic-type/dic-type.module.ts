import { Module } from '@nestjs/common';
import { DicTypeController } from './dic-type.controller';
import { DicTypeService } from './dic-type.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DicTypeController],
  providers: [DicTypeService, AuthService, JwtService],
})
export class DicTypeModule {
}
