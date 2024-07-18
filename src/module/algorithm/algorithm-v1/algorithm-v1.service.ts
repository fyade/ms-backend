import { Injectable } from '@nestjs/common';
import { R } from '../../../common/R';

@Injectable()
export class AlgorithmV1Service {
  async helloWorld(dto: any): Promise<R> {
    return R.ok('Hello World!');
  }

  async test(dto: any): Promise<R> {
    return R.ok(dto);
  }
}
