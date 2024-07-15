import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { getCurrentUser } from '../../../util/baseContext';
import { UserPermissionDeniedException } from '../../../exception/UserPermissionDeniedException';
import { AuthService } from '../../auth/auth.service';
import {
  userRoleDto,
  userRoleSelAllDto,
  userRoleSelListDto,
  userRoleUpdManyRUDto,
  userRoleUpdManyURDto,
  userRoleUpdOneDto,
} from './dto';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
  }

  async selUserRole(dto: userRoleSelListDto): Promise<R> {
    const res = await this.prisma.findPage<userRoleDto, userRoleSelListDto>('sys_user_role', { data: dto });
    return R.ok(res);
  }

  async selAll(dto: userRoleSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<userRoleDto>('sys_user_role', { data: dto, numberKeys: ['roleId'] });
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById<userRoleDto>('sys_user_role', Number(id));
    return R.ok(one);
  }

  async updUserRoleUR(dto: userRoleUpdManyURDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.userId)) {
      throw new UserPermissionDeniedException();
    }
    const allRoles = await this.prisma.findAll<userRoleUpdOneDto>('sys_user_role', { data: { userId: dto.userId } });
    const allRoleIds = allRoles.map((item: any) => item.roleId);
    const addRoles = dto.roleId.filter(id => allRoleIds.indexOf(id) === -1);
    const delRoleIds = allRoleIds.filter(id => dto.roleId.indexOf(id) === -1);
    const delIds = allRoles.filter(item => delRoleIds.indexOf(item.roleId) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_user_role', delIds);
    await this.prisma.createMany('sys_user_role', addRoles.map(item => ({ userId: dto.userId, roleId: item })));
    return R.ok();
  }

  async updUserRoleRU(dto: userRoleUpdManyRUDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const data = [];
    const allUsersOfThisRole = await this.prisma.findAll<userRoleDto>('sys_user_role', {
      data: { roleId: dto.roleId },
      numberKeys: ['roleId'],
    });
    const allUserIdsOfThisRole = allUsersOfThisRole.map(item => item.userId);
    const userIds = dto.userId.filter(item => allUserIdsOfThisRole.indexOf(item) === -1);
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, userId)) {
        throw new UserPermissionDeniedException();
      }
      data.push({
        userId: userId,
        roleId: dto.roleId,
      });
    }
    await this.prisma.createMany('sys_user_role', data);
    return R.ok();
  }

  async delUserRole(ids: any[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    await this.prisma.deleteById<userRoleDto>('sys_user_role', ids);
    return R.ok();
  }
}
