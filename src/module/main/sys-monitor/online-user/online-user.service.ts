import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { CacheTokenService } from '../../cache/cache.token.service';
import { RedisService } from '../../../../redis/redis.service';
import { onlineUserSelListDto } from './dto';

@Injectable()
export class OnlineUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly cacheTokenService: CacheTokenService,
  ) {
  }

  // async selOnlineUser(dto: onlineUserSelListDto): Promise<R> {
  //   // const res = await this.redis.hscan(this.cacheTokenService.USERID_UUID, dto.pageNum, dto.pageSize);
  //   return R.ok(res);
  // }
  //
  // async delOnlineUser(ids: number[]): Promise<R> {
  //   // this.cacheTokenService.
  //   return R.ok();
  // }
}
