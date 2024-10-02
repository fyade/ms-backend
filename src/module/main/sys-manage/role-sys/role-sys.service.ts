import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { roleSysDto, roleSysSelListDto, roleSysSelAllDto, roleSysInsOneDto, roleSysUpdOneDto } from './dto';

@Injectable()
export class RoleSysService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selRoleSys(dto: roleSysSelListDto): Promise<R> {
    const res = await this.prisma.findPage<roleSysDto, roleSysSelListDto>('sys_role_sys', {
      data: dto,
      orderBy: false,
      notNullKeys: ['roleId', 'sysId'],
      numberKeys: ['roleId', 'sysId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllRoleSys(dto: roleSysSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<roleSysDto>('sys_role_sys', {
      data: dto,
      orderBy: false,
      notNullKeys: ['roleId', 'sysId'],
      numberKeys: ['roleId', 'sysId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesRoleSys(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<roleSysDto>('sys_role_sys', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneRoleSys(id: number): Promise<R> {
    const res = await this.prisma.findById<roleSysDto>('sys_role_sys', Number(id));
    return R.ok(res);
  }

  async insRoleSys(dto: roleSysInsOneDto): Promise<R> {
    const res = await this.prisma.create<roleSysDto>('sys_role_sys', dto);
    return R.ok(res);
  }

  async insRoleSyss(dtos: roleSysInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<roleSysDto>('sys_role_sys', dtos);
    return R.ok(res);
  }

  async updRoleSys(dto: roleSysUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<roleSysDto>('sys_role_sys', dto);
    return R.ok(res);
  }

  async updRoleSyss(dtos: roleSysUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<roleSysDto>('sys_role_sys', dtos);
    return R.ok(res);
  }

  async delRoleSys(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<roleSysDto>('sys_role_sys', ids);
    return R.ok(res);
  }
}
