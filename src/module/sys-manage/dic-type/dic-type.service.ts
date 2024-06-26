import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { dicTypeDto, insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class DicTypeService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDicType(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<dicTypeDto, selListDto>('sys_dic_type', {
      data: dto,
      orderBy: true,
      notNullKeys: ['name', 'type', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_dic_type', {
      data: dto,
      orderBy: true,
      notNullKeys: ['name', 'type', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_dic_type', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_dic_type', Number(id));
    return R.ok(res);
  }

  async insDicType(dto: insOneDto): Promise<R> {
    const res = await this.prisma.create('sys_dic_type', dto);
    return R.ok(res);
  }

  async insDicTypes(dtos: insOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_dic_type', dtos);
    return R.ok(res);
  }

  async updDicType(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_dic_type', dto);
    return R.ok(res);
  }

  async updDicTypes(dtos: updOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_dic_type', dtos);
    return R.ok(res);
  }

  async delDicType(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_dic_type', ids);
    return R.ok(res);
  }
}
