import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { randomUUID } from '../../util/IdUtils';
import { jwtConstants } from '../../../config/config';
import * as jwt from 'jsonwebtoken';
import { TokenDto } from '../../common/token';

@Injectable()
export class CacheTokenService {
  readonly UUID_TOKEN = 'zzz:uuid:token';

  // readonly USERID_UUID = 'userid:uuid';

  constructor(
    private readonly redis: RedisService,
  ) {
  }

  /**
   * 生成token
   * @param userId
   * @param username
   * @param loginRole
   */
  async genToken(userId: string, username: string, loginRole: string) {
    const payload: TokenDto = {
      userid: userId,
      username: username,
      loginRole: loginRole,
    };
    const token = jwt.sign(payload, jwtConstants.secret, {
      expiresIn: jwtConstants.expireTime,
    });
    const uuid = randomUUID();
    await this.redis.setex(`${this.UUID_TOKEN}:${uuid}`, jwtConstants.expireTime, token);
    return uuid;
  }

  /**
   * 解析token
   * @param tokenUuid
   */
  async verifyToken(tokenUuid: string): Promise<TokenDto> {
    const token = await this.redis.get(`${this.UUID_TOKEN}:${tokenUuid}`);
    const decoded = jwt.verify(token, jwtConstants.secret) as TokenDto;
    // await this.freshToken(decoded, tokenUuid);
    return decoded;
  }

  async deleteToken(tokenUuid: string) {
    await this.redis.del(`${this.UUID_TOKEN}:${tokenUuid}`);
  }
}
