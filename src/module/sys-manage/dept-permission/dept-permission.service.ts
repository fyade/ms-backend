import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import {
  deptPermissionDto,
  deptPermissionSelAllDto,
  deptPermissionSelListDto,
  deptPermissionUpdManyDPDto,
} from './dto';

@Injectable()
export class DeptPermissionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDeptPermission(dto: deptPermissionSelListDto): Promise<R> {
    const res = await this.prisma.findPage<deptPermissionDto, deptPermissionSelListDto>('sys_dept_permission', {
      data: dto,
      orderBy: false,
      notNullKeys: ['deptId', 'type', 'permissionId'],
      numberKeys: ['deptId', 'permissionId'],
    });
    return R.ok(res);
  }

  async selAll(dto: deptPermissionSelAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_dept_permission', {
      data: dto,
      orderBy: false,
      notNullKeys: ['deptId', 'type', 'permissionId'],
      numberKeys: ['deptId', 'permissionId'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_dept_permission', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_dept_permission', Number(id));
    return R.ok(res);
  }

  async upddp(dto: deptPermissionUpdManyDPDto): Promise<R> {
    const allDeptPermission = await this.prisma.findAll<deptPermissionDto>('sys_dept_permission', {
      data: { deptId: dto.deptId },
      numberKeys: ['deptId'],
    });
    const perIds = allDeptPermission.filter(item => item.type === 'm').map(item => item.permissionId);
    const addDPSPIDS = dto.permissionId.filter(item => perIds.indexOf(item) === -1);
    const delDPS = perIds.filter(item => dto.permissionId.indexOf(item) === -1);
    const delids = allDeptPermission.filter(item => delDPS.indexOf(item.permissionId) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_dept_permission', delids);
    const addDPS = addDPSPIDS.map(item => ({
      deptId: dto.deptId,
      permissionId: item,
      type: 'm',
    }));
    await this.prisma.createMany('sys_dept_permission', addDPS);
    return R.ok();
  }

  async delDeptPermission(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_dept_permission', ids);
    return R.ok(res);
  }
}
