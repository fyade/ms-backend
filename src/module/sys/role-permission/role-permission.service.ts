import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class RolePermissionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selRolePermission(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage_('sys_role_permission', dto);
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById_('sys_role_permission', Number(id));
    return R.ok(one);
  }

  async insRolePermission(dto: insOneDto): Promise<R> {
    await this.prisma.create_('sys_role_permission', dto);
    return R.ok();
  }

  async updRolePermission(dto: updOneDto): Promise<R> {
    await this.prisma.updateById_('sys_role_permission', dto);
    return R.ok();
  }

  async delRolePermission(ids: any[]): Promise<R> {
    await this.prisma.deleteById_('sys_role_permission', ids);
    return R.ok();
  }
}
