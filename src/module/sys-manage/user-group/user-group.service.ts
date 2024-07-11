import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { userGroupDto, insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class UserGroupService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selUserGroup(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<userGroupDto, selListDto>('sys_usergroup', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_usergroup', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_usergroup', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_usergroup', Number(id));
    return R.ok(res);
  }

  async insUserGroup(dto: insOneDto): Promise<R> {
    const res = await this.prisma.create('sys_usergroup', dto);
    return R.ok(res);
  }

  async insUserGroups(dtos: insOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_usergroup', dtos);
    return R.ok(res);
  }

  async updUserGroup(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_usergroup', dto);
    return R.ok(res);
  }

  async updUserGroups(dtos: updOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_usergroup', dtos);
    return R.ok(res);
  }

  async delUserGroup(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_usergroup', ids);
    return R.ok(res);
  }
}
