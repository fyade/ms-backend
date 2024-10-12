import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { getCurrentUser } from '../../../../../util/baseContext';
import { UserPermissionDeniedException } from '../../../../../exception/UserPermissionDeniedException';
import { AuthService } from '../../../../auth/auth.service';
import { UserDeptDto, UserDeptSelListDto, UserDeptSelAllDto, UserDeptInsOneDto, UserDeptUpdOneDto, UserDeptUpdUDDto, UserDeptUpdDUDto } from './dto';
import { CachePermissionService } from '../../../../cache/cache.permission.service';

@Injectable()
export class UserDeptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
  }

  async selUserDept(dto: UserDeptSelListDto): Promise<R> {
    const res = await this.prisma.findPage<UserDeptDto, UserDeptSelListDto>('sys_user_dept', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'deptId'],
      numberKeys: ['deptId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllUserDept(dto: UserDeptSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<UserDeptDto>('sys_user_dept', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'deptId'],
      numberKeys: ['deptId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesUserDept(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<UserDeptDto>('sys_user_dept', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneUserDept(id: number): Promise<R> {
    const res = await this.prisma.findById<UserDeptDto>('sys_user_dept', Number(id));
    return R.ok(res);
  }

  async updUserDeptUD(dto: UserDeptUpdUDDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.userId)) {
      throw new UserPermissionDeniedException();
    }
    const allDepts = await this.prisma.findAll<UserDeptDto>('sys_user_dept', { data: { userId: dto.userId } });
    const allDeptIds = allDepts.map(item => item.deptId);
    const addDepts = dto.deptId.filter(id => allDeptIds.indexOf(id) === -1);
    const delDeptIds = allDeptIds.filter(id => dto.deptId.indexOf(id) === -1);
    const delDepts = allDepts.filter(item => delDeptIds.indexOf(item.deptId) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_user_dept', delDepts);
    await this.prisma.createMany('sys_user_dept', addDepts.map(item => ({ userId: dto.userId, deptId: item })));
    return R.ok();
  }

  async updUserDeptDU(dto: UserDeptUpdDUDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const data = [];
    const allUsersOfThisDept = await this.prisma.findAll<UserDeptDto>('sys_user_dept', {
      data: { deptId: dto.deptId },
      numberKeys: ['deptId'],
    });
    const allUserIdsOfThisDept = allUsersOfThisDept.map(item => item.userId);
    const userIds = dto.userId.filter(item => allUserIdsOfThisDept.indexOf(item) === -1);
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, userId)) {
        throw new UserPermissionDeniedException();
      }
      data.push({
        userId: userId,
        deptId: dto.deptId,
      });
    }
    await this.prisma.createMany('sys_user_dept', data);
    return R.ok();
  }

  async delUserDept(ids: number[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.deleteById<UserDeptDto>('sys_user_dept', ids);
    return R.ok(res);
  }
}
