import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { CacheTokenService } from '../../cache/cache.token.service';

@Injectable()
export class OnlineUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheTokenService:CacheTokenService
  ) {
  }

  async selOnlineUser(): Promise<R> {
    // this.cacheTokenService.
    return R.ok();
  }
}
