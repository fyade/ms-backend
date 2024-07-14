import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { userGroupDto, userGroupSelListDto, userGroupSelAllDto, userGroupInsOneDto, userGroupUpdOneDto } from './dto';

@Injectable()
export class UserGroupService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selUserGroup(dto: userGroupSelListDto): Promise<R> {
    const res = await this.prisma.findPage<userGroupDto, userGroupSelListDto>('sys_usergroup', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: userGroupSelAllDto): Promise<R> {
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

  async insUserGroup(dto: userGroupInsOneDto): Promise<R> {
    const res = await this.prisma.create('sys_usergroup', dto);
    return R.ok(res);
  }

  async insUserGroups(dtos: userGroupInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_usergroup', dtos);
    return R.ok(res);
  }

  async updUserGroup(dto: userGroupUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_usergroup', dto);
    return R.ok(res);
  }

  async updUserGroups(dtos: userGroupUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_usergroup', dtos);
    return R.ok(res);
  }

  async delUserGroup(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_usergroup', ids);
    return R.ok(res);
  }
}
