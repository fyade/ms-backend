import { RedisService } from '../../redis/redis.service';
import { Injectable } from '@nestjs/common';
import { base } from '../../util/base';

@Injectable()
export class CachePermissionService {
  constructor(
    private readonly redis: RedisService,
  ) {
  }

  /**
   * 用户是否有权限在缓存中
   * @param userId
   * @param permission
   */
  async ifHavePermissionInCache(userId: string, permission: string) {
    const value = await this.redis.hget('user:permission', `${permission}---${userId}`);
    return value === base.Y;
  }

  /**
   * 添加用户权限至缓存
   * @param userId
   * @param permission
   */
  async addPermissionInCache(userId: string, permission: string) {
    await this.redis.hset('user:permission', `${permission}---${userId}`, base.Y);
  }

  /**
   * 是否公共接口在缓存中
   * @param permission
   */
  async ifPublicPermissionInCache(permission: string) {
    const value = await this.redis.hget('permission:public', `${permission}`);
    return value === base.Y;
  }

  /**
   * 获取是否公共接口在缓存中原始值
   * @param permission
   */
  async getIfPublicPermissionInCache(permission: string) {
    const value = await this.redis.hget('permission:public', `${permission}`);
    return value;
  }

  /**
   * 添加公共接口至缓存
   * @param permission
   * @param value
   */
  async addPublicPermissionInCache(permission: string, value = base.Y) {
    await this.redis.hset('permission:public', `${permission}`, value);
  }

  /**
   * 删除缓存中的所有权限记录
   */
  async delAllPermissionsInCache() {
    const allPPs = await this.redis.hgetall('permission:public');
    await this.redis.hdel('permission:public', ...Object.keys(allPPs));
    const allUPs = await this.redis.hgetall('user:permission');
    await this.redis.hdel('user:permission', ...Object.keys(allUPs));
  }
}