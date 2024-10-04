import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { roleDto, roleSelListDto, roleSelAllDto, roleInsOneDto, roleUpdOneDto } from './dto';
import { CachePermissionService } from '../../../../cache/cache.permission.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
  }

  async selRole(dto: roleSelListDto): Promise<R> {
    const res = await this.prisma.findPage<roleDto, roleSelListDto>('sys_role', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'ifAdmin', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllRole(dto: roleSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<roleDto>('sys_role', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'ifAdmin', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesRole(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<roleDto>('sys_role', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneRole(id: number): Promise<R> {
    const res = await this.prisma.findById<roleDto>('sys_role', Number(id));
    return R.ok(res);
  }

  async insRole(dto: roleInsOneDto): Promise<R> {
    const res = await this.prisma.create<roleDto>('sys_role', dto);
    return R.ok(res);
  }

  async insRoles(dtos: roleInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<roleDto>('sys_role', dtos);
    return R.ok(res);
  }

  async updRole(dto: roleUpdOneDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.updateById<roleDto>('sys_role', dto);
    return R.ok(res);
  }

  async updRoles(dtos: roleUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<roleDto>('sys_role', dtos);
    return R.ok(res);
  }

  async delRole(ids: number[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.deleteById<roleDto>('sys_role', ids);
    return R.ok(res);
  }
}
