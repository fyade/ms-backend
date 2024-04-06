import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insManyDto, insOneDto, selListDto, updManyDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class UserRoleService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selUserRole(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage('sys_user_role', dto);
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById('sys_user_role', Number(id));
    return R.ok(one);
  }

  async insUserRole(dto: insManyDto): Promise<R> {
    const data = dto.role_id.map(item => ({
      ...dto,
      role_id: item,
    }));
    await this.prisma.createMany('sys_user_role', data);
    return R.ok();
  }

  async updUserRole(dto: updManyDto): Promise<R> {
    const allroles = await this.prisma.findAll<updOneDto>('sys_user_role', { user_id: dto.user_id });
    const allroleids = allroles.map((item: any) => item.role_id);
    const addroles = dto.role_id.filter(id => allroleids.indexOf(id) === -1);
    const delrolds = allroleids.filter(id => dto.role_id.indexOf(id) === -1);
    const delids = allroles.filter(item => delrolds.indexOf(item.role_id) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_user_role', delids);
    await this.prisma.createMany('sys_user_role', addroles.map(item => ({ user_id: dto.user_id, role_id: item })));
    return R.ok();
  }

  async delUserRole(ids: any[]): Promise<R> {
    await this.prisma.deleteById('sys_user_role', ids);
    return R.ok();
  }
}
