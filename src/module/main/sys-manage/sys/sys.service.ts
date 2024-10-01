import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { sysDto, sysSelListDto, sysSelAllDto, sysInsOneDto, sysUpdOneDto } from './dto';

@Injectable()
export class SysService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selSys(dto: sysSelListDto): Promise<R> {
    const res = await this.prisma.findPage<sysDto, sysSelListDto>('sys_sys', {
      data: dto,
      orderBy: true,
      notNullKeys: ['name', 'perms', 'orderNum', 'path'],
      numberKeys: ['orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllSys(dto: sysSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<sysDto>('sys_sys', {
      data: dto,
      orderBy: true,
      notNullKeys: ['name', 'perms', 'orderNum', 'path'],
      numberKeys: ['orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesSys(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<sysDto>('sys_sys', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSys(id: number): Promise<R> {
    const res = await this.prisma.findById<sysDto>('sys_sys', Number(id));
    return R.ok(res);
  }

  async insSys(dto: sysInsOneDto): Promise<R> {
    const res = await this.prisma.create<sysDto>('sys_sys', dto);
    return R.ok(res);
  }

  async insSyss(dtos: sysInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<sysDto>('sys_sys', dtos);
    return R.ok(res);
  }

  async updSys(dto: sysUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<sysDto>('sys_sys', dto);
    return R.ok(res);
  }

  async updSyss(dtos: sysUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<sysDto>('sys_sys', dtos);
    return R.ok(res);
  }

  async delSys(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<sysDto>('sys_sys', ids);
    return R.ok(res);
  }
}
