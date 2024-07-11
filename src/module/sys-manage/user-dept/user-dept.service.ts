import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { userDeptDto, insOneDto, selAllDto, selListDto, updOneDto, userDeptUpdUDDto, userDeptUpdDUDto } from './dto';
import { R } from '../../../common/R';
import { getCurrentUser } from '../../../util/baseContext';
import { UserPermissionDeniedException } from '../../../exception/UserPermissionDeniedException';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserDeptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
  }

  async selUserDept(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<userDeptDto, selListDto>('sys_user_dept', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'deptId'],
      numberKeys: ['deptId'],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_user_dept', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'deptId'],
      numberKeys: ['deptId'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_user_dept', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_user_dept', Number(id));
    return R.ok(res);
  }

  async updUserDeptUD(dto: userDeptUpdUDDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.userId)) {
      throw new UserPermissionDeniedException();
    }
    const allDepts = await this.prisma.findAll<userDeptDto>('sys_user_dept', { data: { userId: dto.userId } });
    const allDeptIds = allDepts.map(item => item.deptId);
    const addDepts = dto.deptId.filter(id => allDeptIds.indexOf(id) === -1);
    const delDeptIds = allDeptIds.filter(id => dto.deptId.indexOf(id) === -1);
    const delDepts = allDepts.filter(item => delDeptIds.indexOf(item.deptId) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_user_dept', delDepts);
    await this.prisma.createMany('sys_user_dept', addDepts.map(item => ({ userId: dto.userId, deptId: item })));
    return R.ok();
  }

  async updUserDeptDU(dto: userDeptUpdDUDto): Promise<R> {
    const data = [];
    const allUsersOfThisDept = await this.prisma.findAll<userDeptDto>('sys_user_dept', {
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

  async delUserDept(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_user_dept', ids);
    return R.ok(res);
  }
}
