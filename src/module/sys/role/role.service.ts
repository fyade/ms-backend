import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selRole(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage_('sys_role', dto);
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById_('sys_role', Number(id));
    return R.ok(one);
  }

  async insRole(dto: insOneDto): Promise<R> {
    await this.prisma.create_('sys_role', dto);
    return R.ok();
  }

  async updRole(dto: updOneDto): Promise<R> {
    await this.prisma.updateById_('sys_role', dto);
    return R.ok();
  }

  async delRole(ids: any[]): Promise<R> {
    await this.prisma.deleteById_('sys_role', ids);
    return R.ok();
  }
}
