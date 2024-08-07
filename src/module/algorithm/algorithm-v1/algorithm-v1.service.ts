import { Injectable } from '@nestjs/common';
import { R } from '../../../common/R';
import { requestSF } from '../../../api/request';

@Injectable()
export class AlgorithmV1Service {
  async helloWorld(dto: any): Promise<R> {
    return R.ok('Hello World!');
  }

  async polygonsIntersect(dto: any): Promise<R> {
    const response = await requestSF({
      url: '/polygons-intersect',
      data: dto,
    });
    return R.ok(response);
  }
}
