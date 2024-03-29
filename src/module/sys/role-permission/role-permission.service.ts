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
    const res = await this.prisma.findPage('sys_role_permission', dto);
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById<rolePermissionDto>('sys_role_permission', Number(id));
    return R.ok(one);
  }

  async selAll(dto: selByRoleIdDto): Promise<R> {
    const res = await this.prisma.findAll<rolePermissionDto>('sys_role_permission', dto);
    const roleIds = res.map(item => item.role_id);
    const permissionIds_m = res.filter(item => item.type === 'm').map(item => item.permission_id);
    // const permissionIds_i = res.filter(item => item.type === 'i').map(item => item.permission_id);
    const roles = await this.prisma.findByIds<roleDto>('sys_role', roleIds);
    const permissions_m = await this.prisma.findByIds<menuDto>('sys_menu', permissionIds_m);
    const ret = roles.map(role => {
      const menuids = res.filter(item => item.role_id === role.id).map(item => item.permission_id);
      const rp = res.find(item => item.role_id === role.id);
      delete rp.role_id;
      delete rp.permission_id;
      return {
        ...rp,
        role_id: role.id,
        permission_id: permissionIds_m,
        role: role,
        menus: permissions_m.filter(item => menuids.indexOf(item.id) > -1),
      };
    });
    return R.ok(ret);
  }

  async insRolePermission(dto: insManyDto): Promise<R> {
    const dtos = dto.permission_id.map(item => ({
      ...dto,
      permission_id: item,
    }));
    for (let i = 0; i < dtos.length; i++) {
      const dto = dtos[i];
      await this.prisma.create('sys_role_permission', dto);
    }
    return R.ok();
  }

  async updRolePermission(dto: updManyDto): Promise<R> {
    const allRolePermissions = await this.prisma.findAll<rolePermissionDto>('sys_role_permission', { role_id: dto.role_id });
    const perIds = allRolePermissions.filter(item => item.type === 'm').map(item => item.permission_id);
    const addRPSPIDS = dto.permission_id.filter(item => perIds.indexOf(item) === -1);
    const delRPS = perIds.filter(item => dto.permission_id.indexOf(item) === -1);
    const delids = allRolePermissions.filter(item => delRPS.indexOf(item.permission_id) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_role_permission', delids);
    const addRPS = addRPSPIDS.map(item => ({
      role_id: dto.role_id,
      permission_id: item,
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
