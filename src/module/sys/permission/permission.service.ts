import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selPermission(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage_('sys_permission', dto);
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById_('sys_permission', Number(id));
    return R.ok(one);
  }

  async insPermission(dto: insOneDto): Promise<R> {
    await this.prisma.create_('sys_permission', dto);
    return R.ok();
  }

  async updPermission(dto: updOneDto): Promise<R> {
    await this.prisma.updateById_('sys_permission', dto);
    return R.ok();
  }

  async delPermission(ids: any[]): Promise<R> {
    await this.prisma.deleteById_('sys_permission', ids);
    return R.ok();
  }
}
