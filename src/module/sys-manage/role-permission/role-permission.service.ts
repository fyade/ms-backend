import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insManyDto, rolePermissionDto, selByRoleIdDto, selListDto, updManyDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { roleDto } from '../role/dto';
import { menuDto } from '../menu/dto';

@Injectable()
export class RolePermissionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selRolePermission(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage('sys_role_permission', { data: dto });
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById<rolePermissionDto>('sys_role_permission', Number(id));
    return R.ok(one);
  }

  async selAll(dto: selByRoleIdDto): Promise<R> {
    const res = await this.prisma.findAll<rolePermissionDto>('sys_role_permission', dto);
    const roleIds = res.map(item => item.roleId);
    const permissionIds_m = res.filter(item => item.type === 'm').map(item => item.permissionId);
    // const permissionIds_i = res.filter(item => item.type === 'i').map(item => item.permission_id);
    const roles = await this.prisma.findByIds<roleDto>('sys_role', roleIds);
    const permissions_m = await this.prisma.findByIds<menuDto>('sys_menu', permissionIds_m);
    const ret = roles.map(role => {
      const menuids = res.filter(item => item.roleId === role.id).map(item => item.permissionId);
      const rp = res.find(item => item.roleId === role.id);
      delete rp.roleId;
      delete rp.permissionId;
      return {
        ...rp,
        roleId: role.id,
        permissionId: permissionIds_m,
        role: role,
        menus: permissions_m.filter(item => menuids.indexOf(item.id) > -1),
      };
    });
    return R.ok(ret);
  }

  async insRolePermission(dto: insManyDto): Promise<R> {
    const dtos = dto.permissionId.map(item => ({
      ...dto,
      permissionId: item,
    }));
    for (let i = 0; i < dtos.length; i++) {
      const dto = dtos[i];
      await this.prisma.create('sys_role_permission', dto);
    }
    return R.ok();
  }

  async updRolePermission(dto: updManyDto): Promise<R> {
    const allRolePermissions = await this.prisma.findAll<rolePermissionDto>('sys_role_permission', { roleId: dto.roleId });
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

  async delRolePermission(ids: any[]): Promise<R> {
    await this.prisma.delete('sys_role_permission', 'permission_id', ids);
    return R.ok();
  }
}
