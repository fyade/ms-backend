import { Module } from '@nestjs/common';
import { AlgorithmController } from './algorithm.controller';
import { AlgorithmService } from './algorithm.service';
import { InterfaceGroupService } from '../sys-manage/interface-group/interface-group.service';
import { InterfaceService } from '../sys-manage/interface/interface.service';

@Module({
  controllers: [AlgorithmController],
  providers: [AlgorithmService, InterfaceService, InterfaceGroupService],
})
export class AlgorithmModule {
}
