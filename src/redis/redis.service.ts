import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { currentEnv } from '../../config/config';

const env = currentEnv();

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password,
      db: env.redis.database,
    });
  }

  // 字符串操作

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async increment(key: string): Promise<number> {
    return await this.redis.incr(key);
  }

  async decrement(key: string): Promise<number> {
    return await this.redis.decr(key);
  }

  // 集合操作

  async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.redis.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return await this.redis.srem(key, ...members);
  }

  async sismember(key: string, member: string): Promise<number> {
    return await this.redis.sismember(key, member);
  }

  async scard(key: string): Promise<number> {
    return await this.redis.scard(key);
  }

  // 哈希操作

  async hset(key: string, field: string, value: string): Promise<number> {
    return await this.redis.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return await this.redis.hget(key, field);
  }

  async hgetall(key: string): Promise<{ [field: string]: string }> {
    return await this.redis.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return await this.redis.hdel(key, ...fields);
  }

  async hkeys(key: string): Promise<string[]> {
    return await this.redis.hkeys(key);
  }

  async hvals(key: string): Promise<string[]> {
    return await this.redis.hvals(key);
  }

  async hlen(key: string): Promise<number> {
    return await this.redis.hlen(key);
  }
}
