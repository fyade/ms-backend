import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import {
  interfaceInterfaceGroupDto,
  interfaceInterfaceGroupSelListDto,
  interfaceInterfaceGroupSelAllDto,
  interfaceInterfaceGroupInsOneDto,
  interfaceInterfaceGroupUpdOneDto,
  interfaceInterfaceGroupUpdIIGDto, interfaceInterfaceGroupUpdIGIDto,
} from './dto';

@Injectable()
export class InterfaceInterfaceGroupService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selInterfaceInterfaceGroup(dto: interfaceInterfaceGroupSelListDto): Promise<R> {
    const res = await this.prisma.findPage<interfaceInterfaceGroupDto, interfaceInterfaceGroupSelListDto>('sys_interface_interface_group', {
      data: dto,
      orderBy: false,
      notNullKeys: ['interfaceId', 'interfaceGroupId'],
      numberKeys: ['interfaceId', 'interfaceGroupId'],
    });
    return R.ok(res);
  }

  async selAll(dto: interfaceInterfaceGroupSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<interfaceInterfaceGroupDto>('sys_interface_interface_group', {
      data: dto,
      orderBy: false,
      notNullKeys: ['interfaceId', 'interfaceGroupId'],
      numberKeys: ['interfaceId', 'interfaceGroupId'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds<interfaceInterfaceGroupDto>('sys_interface_interface_group', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById<interfaceInterfaceGroupDto>('sys_interface_interface_group', Number(id));
    return R.ok(res);
  }

  async updInterfaceInterfaceGroupIIG(dto: interfaceInterfaceGroupUpdIIGDto) {
    const allInterfaceGroupsOfThisInterface = await this.prisma.findAll<interfaceInterfaceGroupDto>('sys_interface_interface_group', {
      data: { interfaceId: dto.interfaceId },
      numberKeys: ['interfaceId'],
    });
    const allInterfaceGroupIdsOfThisInterface = allInterfaceGroupsOfThisInterface.map(item => item.interfaceGroupId);
    const interfaceGroupIds = dto.interfaceGroupId.filter(item => allInterfaceGroupIdsOfThisInterface.indexOf(item) === -1);
    const data = interfaceGroupIds.map(interfaceGroupId => ({
      interfaceGroupId: interfaceGroupId,
      interfaceId: dto.interfaceId,
    }));
    const deleteIds = allInterfaceGroupsOfThisInterface.filter(item => dto.interfaceGroupId.indexOf(item.interfaceGroupId) === -1).map(item => item.id);
    await this.prisma.createMany('sys_interface_interface_group', data);
    await this.prisma.deleteById('sys_interface_interface_group', deleteIds);
    return R.ok();
  }

  async updInterfaceInterfaceGroupIGI(dto: interfaceInterfaceGroupUpdIGIDto) {
    const allInterfacesOfThisInterfaceGroup = await this.prisma.findAll<interfaceInterfaceGroupDto>('sys_interface_interface_group', {
      data: { interfaceGroupId: dto.interfaceGroupId },
      numberKeys: ['interfaceGroupId'],
    });
    const allInterfaceIdsOfThisInterfaceGroup = allInterfacesOfThisInterfaceGroup.map(item => item.interfaceId);
    const interfaceIds = dto.interfaceId.filter(item => allInterfaceIdsOfThisInterfaceGroup.indexOf(item) === -1);
    const data = interfaceIds.map(interfaceId => ({
      interfaceId: interfaceId,
      interfaceGroupId: dto.interfaceGroupId,
    }));
    await this.prisma.createMany('sys_interface_interface_group', data);
    return R.ok();
  }

  async delInterfaceInterfaceGroup(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById<interfaceInterfaceGroupDto>('sys_interface_interface_group', ids);
    return R.ok(res);
  }
}
