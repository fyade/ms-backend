import { RedisService } from '../../redis/redis.service';
import { Injectable } from '@nestjs/common';
import { base } from '../../util/base';

@Injectable()
export class CachePermissionService {
  private readonly USER_PERMISSION = 'user:permission';
  private readonly PERMISSION_PUBLIC = 'permission:public';

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
    const value = await this.redis.hget(this.USER_PERMISSION, `${permission}---${userId}`);
    return value === base.Y;
  }

  /**
   * 添加用户权限至缓存
   * @param userId
   * @param permission
   */
  async addPermissionInCache(userId: string, permission: string) {
    await this.redis.hset(this.USER_PERMISSION, `${permission}---${userId}`, base.Y);
  }

  /**
   * 是否公共接口在缓存中
   * @param permission
   */
  async ifPublicPermissionInCache(permission: string) {
    const value = await this.redis.hget(this.PERMISSION_PUBLIC, `${permission}`);
    return value === base.Y;
  }

  /**
   * 获取是否公共接口在缓存中原始值
   * @param permission
   */
  async getIfPublicPermissionInCache(permission: string) {
    const value = await this.redis.hget(this.PERMISSION_PUBLIC, `${permission}`);
    return value;
  }

  /**
   * 添加公共接口至缓存
   * @param permission
   * @param value
   */
  async addPublicPermissionInCache(permission: string, value = base.Y) {
    await this.redis.hset(this.PERMISSION_PUBLIC, `${permission}`, value);
  }

  /**
   * 删除缓存中的所有权限记录
   */
  async clearPermissionsInCache() {
    const allPPs = await this.redis.hgetall(this.PERMISSION_PUBLIC);
    if (Object.keys(allPPs).length > 0) {
      await this.redis.hdel(this.PERMISSION_PUBLIC, ...Object.keys(allPPs));
    }
    const allUPs = await this.redis.hgetall(this.USER_PERMISSION);
    if (Object.keys(allUPs).length > 0) {
      await this.redis.hdel(this.USER_PERMISSION, ...Object.keys(allUPs));
    }
  }
}
