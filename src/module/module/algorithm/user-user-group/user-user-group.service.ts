import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { UserUserGroupDto, UserUserGroupSelListDto, UserUserGroupSelAllDto, UserUserGroupInsOneDto, UserUserGroupUpdOneDto, UserUserGroupUpdUUGDtp, UserUserGroupUpdUGUDtp } from './dto';
import { AuthService } from '../../../auth/auth.service';
import { getCurrentUser } from '../../../../util/baseContext';
import { UserPermissionDeniedException } from '../../../../exception/UserPermissionDeniedException';

@Injectable()
export class UserUserGroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
  }

  async selUserUserGroup(dto: UserUserGroupSelListDto): Promise<R> {
    const res = await this.prisma.findPage<UserUserGroupDto, UserUserGroupSelListDto>('sys_user_user_group', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'userGroupId'],
      numberKeys: ['userGroupId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllUserUserGroup(dto: UserUserGroupSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<UserUserGroupDto>('sys_user_user_group', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'userGroupId'],
      numberKeys: ['userGroupId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesUserUserGroup(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<UserUserGroupDto>('sys_user_user_group', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneUserUserGroup(id: number): Promise<R> {
    const res = await this.prisma.findById<UserUserGroupDto>('sys_user_user_group', Number(id));
    return R.ok(res);
  }

  async updUserUserGroupUUG(dto: UserUserGroupUpdUUGDtp): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.userId)) {
      throw new UserPermissionDeniedException();
    }
    const allUserGroups = await this.prisma.findAll<UserUserGroupDto>('sys_user_user_group', { data: { userId: dto.userId } });
    const allUserGroupIds = allUserGroups.map(item => item.id);
    const addUserGroups = dto.userGroupId.filter(id => allUserGroupIds.indexOf(id) === -1);
    const delUserGroupIds = allUserGroupIds.filter(id => dto.userGroupId.indexOf(id) === -1);
    const delUserGroups = allUserGroups.filter(item => delUserGroupIds.indexOf(item.userGroupId) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_user_user_group', delUserGroupIds);
    await this.prisma.createMany('sys_user_user_group', addUserGroups.map(item => ({
      userId: dto.userId,
      userGroupId: item,
    })));
    return R.ok();
  }

  async updUserUserGroupUGU(dto: UserUserGroupUpdUGUDtp): Promise<R> {
    const data = [];
    const allUsersOfThisUserGroup = await this.prisma.findAll<UserUserGroupDto>('sys_user_user_group', {
      data: { userGroupId: dto.userGroupId },
      numberKeys: ['userGroupId'],
    });
    const allUserIdsOfThisUserGroup = allUsersOfThisUserGroup.map(item => item.userId);
    const userIds = dto.userId.filter(item => allUserIdsOfThisUserGroup.indexOf(item) === -1);
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, userId)) {
        throw new UserPermissionDeniedException();
      }
      data.push({
        userId: userId,
        userGroupId: dto.userGroupId,
      });
    }
    await this.prisma.createMany('sys_user_user_group', data);
    return R.ok();
  }

  async delUserUserGroup(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<UserUserGroupDto>('sys_user_user_group', ids);
    return R.ok(res);
  }
}
