import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { deptDto, deptInsOneDto, deptSelAllDto, deptSelListDto, deptUpdOneDto } from './dto';

@Injectable()
export class DeptService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDept(dto: deptSelListDto): Promise<R> {
    const res = await this.prisma.findPage<deptDto, deptSelListDto>('sys_dept', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: deptSelAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_dept', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_dept', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_dept', Number(id));
    return R.ok(res);
  }

  async insDept(dto: deptInsOneDto): Promise<R> {
    const res = await this.prisma.create('sys_dept', dto);
    return R.ok(res);
  }

  async insDepts(dtos: deptInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_dept', dtos);
    return R.ok(res);
  }

  async updDept(dto: deptUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_dept', dto);
    return R.ok(res);
  }

  async updDepts(dtos: deptUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_dept', dtos);
    return R.ok(res);
  }

  async delDept(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_dept', ids);
    return R.ok(res);
  }
}
