import { Module } from '@nestjs/common';
import { DicDataController } from './dic-data.controller';
import { DicDataService } from './dic-data.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DicDataController],
  providers: [DicDataService, AuthService, JwtService],
})
export class DicDataModule {
}
