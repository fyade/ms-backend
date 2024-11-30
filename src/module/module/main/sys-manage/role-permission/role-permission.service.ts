import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { RolePermissionDto, RolePermissionSelListDto, RolePermissionSelAllDto, RolePermissionInsOneDto, RolePermissionUpdOneDto, RolePermissionUpdManyDto } from './dto';
import { CachePermissionService } from '../../../../cache/cache.permission.service';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
  }

  async selRolePermission(dto: RolePermissionSelListDto): Promise<R> {
    const res = await this.prisma.findPage<RolePermissionDto, RolePermissionSelListDto>('sys_role_permission', { data: dto });
    return R.ok(res);
  }

  async selAllRolePermission(dto: RolePermissionSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<RolePermissionDto>('sys_role_permission', {
      data: dto,
      orderBy: false,
      notNullKeys: ['roleId', 'type', 'permissionId'],
      numberKeys: ['roleId', 'permissionId'],
    });
    return R.ok(res);
  }

  async selOneRolePermission(id: number): Promise<R> {
    const one = await this.prisma.findById<RolePermissionDto>('sys_role_permission', Number(id));
    return R.ok(one);
  }

  async updRolePermissionRp(dto: RolePermissionUpdManyDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const allRolePermissions = await this.prisma.findAll<RolePermissionDto>('sys_role_permission', {
      data: { roleId: dto.roleId },
      numberKeys: ['roleId'],
    });
    const perIds = allRolePermissions.filter(item => item.type === 'm').map(item => item.permissionId);
    const addRPSPIDS = dto.permissionId.filter(item => perIds.indexOf(item) === -1);
    const delRPS = perIds.filter(item => dto.permissionId.indexOf(item) === -1);
    const delids = allRolePermissions.filter(item => delRPS.indexOf(item.permissionId) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_role_permission', delids);
    const addRPS = addRPSPIDS.map(item => ({
      roleId: dto.roleId,
      permissionId: item,
      type: 'm',
    }));
    await this.prisma.createMany('sys_role_permission', addRPS);
    return R.ok();
  }

  async delRolePermission(ids: number[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    await this.prisma.delete<RolePermissionDto>('sys_role_permission', 'permission_id', ids);
    return R.ok();
  }
}
