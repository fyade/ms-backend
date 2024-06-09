import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insManyDto, insOneDto, selListDto, updManyDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { getCurrentUser } from '../../../util/baseContext';
import { UserPermissionDeniedException } from '../../../exception/UserPermissionDeniedException';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
  }

  async selUserRole(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage('sys_user_role', { data: dto });
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById('sys_user_role', Number(id));
    return R.ok(one);
  }

  async insUserRole(dto: insManyDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.userId)) {
      throw new UserPermissionDeniedException();
    }
    const data = dto.roleId.map(item => ({
      ...dto,
      roleId: item,
    }));
    await this.prisma.createMany('sys_user_role', data);
    return R.ok();
  }

  async updUserRole(dto: updManyDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.userId)) {
      throw new UserPermissionDeniedException();
    }
    const allroles = await this.prisma.findAll<updOneDto>('sys_user_role', { data: { userId: dto.userId } });
    const allroleids = allroles.map((item: any) => item.roleId);
    const addroles = dto.roleId.filter(id => allroleids.indexOf(id) === -1);
    const delrolds = allroleids.filter(id => dto.roleId.indexOf(id) === -1);
    const delids = allroles.filter(item => delrolds.indexOf(item.roleId) > -1).map(item => item.id);
    await this.prisma.deleteById('sys_user_role', delids);
    await this.prisma.createMany('sys_user_role', addroles.map(item => ({ userId: dto.userId, roleId: item })));
    return R.ok();
  }

  async delUserRole(ids: any[]): Promise<R> {
    await this.prisma.deleteById('sys_user_role', ids);
    return R.ok();
  }
}
