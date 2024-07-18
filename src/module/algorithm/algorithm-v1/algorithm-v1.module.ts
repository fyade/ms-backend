import { Module } from '@nestjs/common';
import { AlgorithmV1Controller } from './algorithm-v1.controller';
import { AlgorithmV1Service } from './algorithm-v1.service';

@Module({
  controllers: [AlgorithmV1Controller],
  providers: [AlgorithmV1Service],
})
export class AlgorithmV1Module {
}
