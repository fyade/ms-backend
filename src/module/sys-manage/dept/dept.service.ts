import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { deptDto, deptSelListDto, deptSelAllDto, deptInsOneDto, deptUpdOneDto } from './dto';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Injectable()
export class DeptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
  }

  async selDept(dto: deptSelListDto): Promise<R> {
    const res = await this.prisma.findPage<deptDto, deptSelListDto>('sys_dept', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'ifAdmin', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAllDept(dto: deptSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<deptDto>('sys_dept', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'ifAdmin', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selOnesDept(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<deptDto>('sys_dept', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneDept(id: number): Promise<R> {
    const res = await this.prisma.findById<deptDto>('sys_dept', Number(id));
    return R.ok(res);
  }

  async insDept(dto: deptInsOneDto): Promise<R> {
    const res = await this.prisma.create<deptDto>('sys_dept', dto);
    return R.ok(res);
  }

  async insDepts(dtos: deptInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<deptDto>('sys_dept', dtos);
    return R.ok(res);
  }

  async updDept(dto: deptUpdOneDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.updateById<deptDto>('sys_dept', dto);
    return R.ok(res);
  }

  async updDepts(dtos: deptUpdOneDto[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.updateMany<deptDto>('sys_dept', dtos);
    return R.ok(res);
  }

  async delDept(ids: number[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    const res = await this.prisma.deleteById<deptDto>('sys_dept', ids);
    return R.ok(res);
  }
}
