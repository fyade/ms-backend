import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { currentEnv } from '../../config/config';

const env = currentEnv();

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password,
      db: env.redis.database,
    });
  }

  setValue(key: string, value: string) {
    return this.client.set(key, value);
  }

  getValue(key: string) {
    return this.client.get(key);
  }
}
