import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { dicTypeDto, dicTypeSelListDto, dicTypeSelAllDto, dicTypeInsOneDto, dicTypeUpdOneDto } from './dto';

@Injectable()
export class DicTypeService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDicType(dto: dicTypeSelListDto): Promise<R> {
    const res = await this.prisma.findPage<dicTypeDto, dicTypeSelListDto>('sys_dic_type', {
      data: dto,
      orderBy: true,
      notNullKeys: ['name', 'type', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selAllDicType(dto: dicTypeSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<dicTypeDto>('sys_dic_type', {
      data: dto,
      orderBy: true,
      notNullKeys: ['name', 'type', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selOnesDicType(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<dicTypeDto>('sys_dic_type', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneDicType(id: number): Promise<R> {
    const res = await this.prisma.findById<dicTypeDto>('sys_dic_type', Number(id));
    return R.ok(res);
  }

  async insDicType(dto: dicTypeInsOneDto): Promise<R> {
    const res = await this.prisma.create<dicTypeDto>('sys_dic_type', dto);
    return R.ok(res);
  }

  async insDicTypes(dtos: dicTypeInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<dicTypeDto>('sys_dic_type', dtos);
    return R.ok(res);
  }

  async updDicType(dto: dicTypeUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<dicTypeDto>('sys_dic_type', dto);
    return R.ok(res);
  }

  async updDicTypes(dtos: dicTypeUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<dicTypeDto>('sys_dic_type', dtos);
    return R.ok(res);
  }

  async delDicType(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<dicTypeDto>('sys_dic_type', ids);
    return R.ok(res);
  }
}
