import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { generateToken, verifyToken } from '../../util/AuthUtils';
import { randomUUID } from '../../util/IdUtils';

@Injectable()
export class CacheTokenService {
  private readonly UUID_TOKEN = 'uuid:token';
  private readonly USERID_UUID = 'userid:uuid';

  constructor(
    private readonly redis: RedisService,
  ) {
  }

  /**
   * 生成token
   * @param user
   */
  async genToken(user: any) {
    const token = generateToken(user);
    const uuid = randomUUID();
    await this.redis.hset(this.UUID_TOKEN, uuid, token);
    const uuidOfThisUser = await this.redis.hget(this.USERID_UUID, user.id);
    if (uuidOfThisUser) {
      await this.redis.hdel(this.UUID_TOKEN, uuidOfThisUser);
    }
    await this.redis.hset(this.USERID_UUID, user.id, uuid);
    return uuid;
  }

  /**
   * 刷新缓存中的token
   * @param user
   * @param uuid
   */
  async freshToken(user: any, uuid: string) {
    const token = generateToken(user);
    await this.redis.hset(this.UUID_TOKEN, uuid, token);
  }

  /**
   * 解析token
   * @param tokenUuid
   */
  async verifyToken(tokenUuid: string) {
    const token = await this.redis.hget(this.UUID_TOKEN, tokenUuid);
    const decoded = verifyToken(token);
    // await this.freshToken(decoded, tokenUuid);
    return decoded;
  }
}
