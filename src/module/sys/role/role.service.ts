import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insOneDto, roleDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selRole(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage('sys_role', dto, true);
    return R.ok(res);
  }

  async selAll(): Promise<R> {
    const res = await this.prisma.findAll<roleDto>('sys_role', null, true);
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById('sys_role', Number(id));
    return R.ok(one);
  }

  async insRole(dto: insOneDto): Promise<R> {
    await this.prisma.create('sys_role', dto);
    return R.ok();
  }

  async updRole(dto: updOneDto): Promise<R> {
    await this.prisma.updateById('sys_role', dto);
    return R.ok();
  }

  async delRole(ids: any[]): Promise<R> {
    await this.prisma.deleteById('sys_role', ids);
    return R.ok();
  }
}
