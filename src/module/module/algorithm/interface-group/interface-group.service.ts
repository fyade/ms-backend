import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { interfaceGroupDto, interfaceGroupSelListDto, interfaceGroupSelAllDto, interfaceGroupInsOneDto, interfaceGroupUpdOneDto } from './dto';

@Injectable()
export class InterfaceGroupService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selInterfaceGroup(dto: interfaceGroupSelListDto): Promise<R> {
    const res = await this.prisma.findPage<interfaceGroupDto, interfaceGroupSelListDto>('sys_interface_group', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'baseURL', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllInterfaceGroup(dto: interfaceGroupSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<interfaceGroupDto>('sys_interface_group', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'parentId', 'baseURL', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesInterfaceGroup(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<interfaceGroupDto>('sys_interface_group', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneInterfaceGroup(id: number): Promise<R<interfaceGroupDto>> {
    const res = await this.prisma.findById<interfaceGroupDto>('sys_interface_group', Number(id));
    return R.ok(res);
  }

  async insInterfaceGroup(dto: interfaceGroupInsOneDto): Promise<R> {
    const res = await this.prisma.create<interfaceGroupDto>('sys_interface_group', dto);
    return R.ok(res);
  }

  async insInterfaceGroups(dtos: interfaceGroupInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<interfaceGroupDto>('sys_interface_group', dtos);
    return R.ok(res);
  }

  async updInterfaceGroup(dto: interfaceGroupUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<interfaceGroupDto>('sys_interface_group', dto);
    return R.ok(res);
  }

  async updInterfaceGroups(dtos: interfaceGroupUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<interfaceGroupDto>('sys_interface_group', dtos);
    return R.ok(res);
  }

  async delInterfaceGroup(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<interfaceGroupDto>('sys_interface_group', ids);
    return R.ok(res);
  }
}
