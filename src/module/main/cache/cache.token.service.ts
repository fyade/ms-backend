import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../redis/redis.service';
import { generateToken, verifyToken } from '../../../util/AuthUtils';
import { randomUUID } from '../../../util/IdUtils';
import { userDto } from '../sys-manage/user/dto';
import { jwtConstants } from '../../../../config/authConfig';

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
   * @param user
   */
  async genToken(user: userDto) {
    const token = generateToken(user);
    const uuid = randomUUID();
    await this.redis.setex(`${this.UUID_TOKEN}:${uuid}`, jwtConstants.expireTime, token);
    // const uuidOfThisUser = await this.redis.hget(this.USERID_UUID, user.id);
    // if (uuidOfThisUser) {
    //   await this.redis.hset(this.USERID_UUID, user.id, JSON.stringify([...JSON.parse(uuidOfThisUser), { uuid }]));
    // } else {
    //   await this.redis.hset(this.USERID_UUID, user.id, JSON.stringify([{ uuid }]));
    // }
    return uuid;
  }

  // /**
  //  * 刷新缓存中的token
  //  * @param user
  //  * @param uuid
  //  */
  // async freshToken(user: userDto, uuid: string) {
  //   const token = generateToken(user);
  //   await this.redis.hset(this.UUID_TOKEN, uuid, token);
  // }

  /**
   * 解析token
   * @param tokenUuid
   */
  async verifyToken(tokenUuid: string) {
    const token = await this.redis.get(`${this.UUID_TOKEN}:${tokenUuid}`);
    const decoded = verifyToken(token);
    // await this.freshToken(decoded, tokenUuid);
    return decoded;
  }
}
