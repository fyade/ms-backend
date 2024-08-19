import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { interfaceDto, interfaceSelListDto, interfaceSelAllDto, interfaceInsOneDto, interfaceUpdOneDto } from './dto';

@Injectable()
export class InterfaceService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selInterface(dto: interfaceSelListDto): Promise<R> {
    const res = await this.prisma.findPage<interfaceDto, interfaceSelListDto>('sys_interface', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'orderNum', 'ifDisabled', 'ifPublic', 'perms', 'url'],
      numberKeys: ['orderNum'],
      completeMatchingKeys: ['perms'],
    });
    return R.ok(res);
  }

  async selAllInterface(dto: interfaceSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<interfaceDto>('sys_interface', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'orderNum', 'ifDisabled', 'ifPublic', 'perms', 'url'],
      numberKeys: ['orderNum'],
      completeMatchingKeys: ['perms'],
    });
    return R.ok(res);
  }

  async selOnesInterface(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<interfaceDto>('sys_interface', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneInterface(id: number): Promise<R> {
    const res = await this.prisma.findById<interfaceDto>('sys_interface', Number(id));
    return R.ok(res);
  }

  async insInterface(dto: interfaceInsOneDto): Promise<R> {
    const res = await this.prisma.create<interfaceDto>('sys_interface', dto);
    return R.ok(res);
  }

  async insInterfaces(dtos: interfaceInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<interfaceDto>('sys_interface', dtos);
    return R.ok(res);
  }

  async updInterface(dto: interfaceUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<interfaceDto>('sys_interface', dto);
    return R.ok(res);
  }

  async updInterfaces(dtos: interfaceUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<interfaceDto>('sys_interface', dtos);
    return R.ok(res);
  }

  async delInterface(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<interfaceDto>('sys_interface', ids);
    return R.ok(res);
  }
}
