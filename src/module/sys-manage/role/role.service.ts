import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { insOneDto, roleDto, selListDto, selAllDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selRole(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage('sys_role', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'ifAdmin', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const dto_ = dto;
    if (dto_.id) dto_.id = Number(dto_.id);
    const res = await this.prisma.findAll<roleDto>('sys_role', {
      data: dto_,
      orderBy: true,
      notNullKeys: ['id', 'label', 'ifAdmin', 'ifDisabled', 'orderNum'],
      numberKeys: ['id', 'orderNum'],
    });
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
