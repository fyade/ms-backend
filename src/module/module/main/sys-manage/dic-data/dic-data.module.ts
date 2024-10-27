import { Global, Module } from '@nestjs/common';
import { DicDataController } from './dic-data.controller';
import { DicDataService } from './dic-data.service';

@Global()
@Module({
  controllers: [DicDataController],
  providers: [DicDataService],
  exports: [DicDataService]
})
export class DicDataModule {
}
