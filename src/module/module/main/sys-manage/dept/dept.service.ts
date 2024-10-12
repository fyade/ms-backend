import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { DeptDto, DeptSelListDto, DeptSelAllDto, DeptInsOneDto, DeptUpdOneDto } from './dto';
import { CachePermissionService } from '../../../../cache/cache.permission.service';

@Injectable()
export class DeptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
  }

  async selDept(dto: DeptSelListDto): Promise<R> {
    const res = await this.prisma.findPage<DeptDto, DeptSelListDto>('sys_dept', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'ifAdmin', 'ifDisabled', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllDept(dto: DeptSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<DeptDto>('sys_dept', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'ifAdmin', 'ifDisabled', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesDept(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<DeptDto>('sys_dept', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneDept(id: number): Promise<R> {
    const res = await this.prisma.findById<DeptDto>('sys_dept', Number(id));
    return R.ok(res);
  }

  async insDept(dto: DeptInsOneDto): Promise<R> {
    const res = await this.prisma.create<DeptDto>('sys_dept', dto);
    return R.ok(res);
  }

  async insDepts(dtos: DeptInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<DeptDto>('sys_dept', dtos);
    return R.ok(res);
  }

  async updDept(dto: DeptUpdOneDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.updateById<DeptDto>('sys_dept', dto);
    return R.ok(res);
  }

  async updDepts(dtos: DeptUpdOneDto[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.updateMany<DeptDto>('sys_dept', dtos);
    return R.ok(res);
  }

  async delDept(ids: number[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.deleteById<DeptDto>('sys_dept', ids);
    return R.ok(res);
  }
}
