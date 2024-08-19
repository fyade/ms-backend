import { Injectable } from '@nestjs/common';
import { R } from '../../common/R';
import { algorithmDto } from './dto';
import { requestSF } from '../../api/request';

@Injectable()
export class AlgorithmService {
  private urls: { perms: string, url: string }[] = [
    {
      perms: 'polygonsIntersect',
      url: '/polygons-intersect',
    },
  ];

  async algorithm(dto: algorithmDto): Promise<R> {
    const find = this.urls.find(item => item.perms === dto.perms);
    if (find) {
      const response = await requestSF({
        url: find.url,
        data: dto.data,
      });
      return R.ok(response);
    }
    return R.err('');
  }
}
