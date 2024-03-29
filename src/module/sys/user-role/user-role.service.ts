import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insOneDto, selListDto, updOneDto } from './dto';
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

  async insUserRole(dto: insOneDto): Promise<R> {
    await this.prisma.create('sys_user_role', dto);
    return R.ok();
  }

  async updUserRole(dto: updOneDto): Promise<R> {
    await this.prisma.updateById('sys_user_role', dto);
    return R.ok();
  }

  async delUserRole(ids: any[]): Promise<R> {
    await this.prisma.deleteById('sys_user_role', ids);
    return R.ok();
  }
}
