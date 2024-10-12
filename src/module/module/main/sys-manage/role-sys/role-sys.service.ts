import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { RoleSysDto, RoleSysSelListDto, RoleSysSelAllDto, RoleSysInsOneDto, RoleSysUpdOneDto } from './dto';

@Injectable()
export class RoleSysService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selRoleSys(dto: RoleSysSelListDto): Promise<R> {
    const res = await this.prisma.findPage<RoleSysDto, RoleSysSelListDto>('sys_role_sys', {
      data: dto,
      orderBy: false,
      notNullKeys: ['roleId', 'sysId'],
      numberKeys: ['roleId', 'sysId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllRoleSys(dto: RoleSysSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<RoleSysDto>('sys_role_sys', {
      data: dto,
      orderBy: false,
      notNullKeys: ['roleId', 'sysId'],
      numberKeys: ['roleId', 'sysId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesRoleSys(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<RoleSysDto>('sys_role_sys', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneRoleSys(id: number): Promise<R> {
    const res = await this.prisma.findById<RoleSysDto>('sys_role_sys', Number(id));
    return R.ok(res);
  }

  async insRoleSys(dto: RoleSysInsOneDto): Promise<R> {
    const res = await this.prisma.create<RoleSysDto>('sys_role_sys', dto);
    return R.ok(res);
  }

  async insRoleSyss(dtos: RoleSysInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<RoleSysDto>('sys_role_sys', dtos);
    return R.ok(res);
  }

  async updRoleSys(dto: RoleSysUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<RoleSysDto>('sys_role_sys', dto);
    return R.ok(res);
  }

  async updRoleSyss(dtos: RoleSysUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<RoleSysDto>('sys_role_sys', dtos);
    return R.ok(res);
  }

  async delRoleSys(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<RoleSysDto>('sys_role_sys', ids);
    return R.ok(res);
  }
}
