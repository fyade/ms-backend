import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { deptSysDto, deptSysSelListDto, deptSysSelAllDto, deptSysInsOneDto, deptSysUpdOneDto } from './dto';

@Injectable()
export class DeptSysService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDeptSys(dto: deptSysSelListDto): Promise<R> {
    const res = await this.prisma.findPage<deptSysDto, deptSysSelListDto>('sys_dept_sys', {
      data: dto,
      orderBy: false,
      notNullKeys: ['deptId', 'sysId'],
      numberKeys: ['deptId', 'sysId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllDeptSys(dto: deptSysSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<deptSysDto>('sys_dept_sys', {
      data: dto,
      orderBy: false,
      notNullKeys: ['deptId', 'sysId'],
      numberKeys: ['deptId', 'sysId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesDeptSys(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<deptSysDto>('sys_dept_sys', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneDeptSys(id: number): Promise<R> {
    const res = await this.prisma.findById<deptSysDto>('sys_dept_sys', Number(id));
    return R.ok(res);
  }

  async insDeptSys(dto: deptSysInsOneDto): Promise<R> {
    const res = await this.prisma.create<deptSysDto>('sys_dept_sys', dto);
    return R.ok(res);
  }

  async insDeptSyss(dtos: deptSysInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<deptSysDto>('sys_dept_sys', dtos);
    return R.ok(res);
  }

  async updDeptSys(dto: deptSysUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<deptSysDto>('sys_dept_sys', dto);
    return R.ok(res);
  }

  async updDeptSyss(dtos: deptSysUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<deptSysDto>('sys_dept_sys', dtos);
    return R.ok(res);
  }

  async delDeptSys(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<deptSysDto>('sys_dept_sys', ids);
    return R.ok(res);
  }
}
