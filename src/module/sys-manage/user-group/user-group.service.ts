import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { userGroupDto, userGroupSelListDto, userGroupSelAllDto, userGroupInsOneDto, userGroupUpdOneDto } from './dto';

@Injectable()
export class UserGroupService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selUserGroup(dto: userGroupSelListDto): Promise<R> {
    const res = await this.prisma.findPage<userGroupDto, userGroupSelListDto>('sys_user_group', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAllUserGroup(dto: userGroupSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<userGroupDto>('sys_user_group', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selOnesUserGroup(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds<userGroupDto>('sys_user_group', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneUserGroup(id: number): Promise<R> {
    const res = await this.prisma.findById<userGroupDto>('sys_user_group', Number(id));
    return R.ok(res);
  }

  async insUserGroup(dto: userGroupInsOneDto): Promise<R> {
    const res = await this.prisma.create<userGroupDto>('sys_user_group', dto);
    return R.ok(res);
  }

  async insUserGroups(dtos: userGroupInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<userGroupDto>('sys_user_group', dtos);
    return R.ok(res);
  }

  async updUserGroup(dto: userGroupUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<userGroupDto>('sys_user_group', dto);
    return R.ok(res);
  }

  async updUserGroups(dtos: userGroupUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<userGroupDto>('sys_user_group', dtos);
    return R.ok(res);
  }

  async delUserGroup(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById<userGroupDto>('sys_user_group', ids);
    return R.ok(res);
  }
}
