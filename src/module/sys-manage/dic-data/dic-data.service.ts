import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { dicDataDto, dicDataInsOneDto, dicDataSelAllDto, dicDataSelListDto, dicDataUpdOneDto } from './dto';

@Injectable()
export class DicDataService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDicData(dto: dicDataSelListDto): Promise<R> {
    const res = await this.prisma.findPage<dicDataDto, dicDataSelListDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'value', 'dicType', 'ifDefault', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selAllDicData(dto: dicDataSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<dicDataDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'value', 'dicType', 'ifDefault', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selOnesDicData(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds<dicDataDto>('sys_dic_data', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneDicData(id: number): Promise<R> {
    const res = await this.prisma.findById<dicDataDto>('sys_dic_data', Number(id));
    return R.ok(res);
  }

  async insDicData(dto: dicDataInsOneDto): Promise<R> {
    const res = await this.prisma.create<dicDataDto>('sys_dic_data', dto);
    return R.ok(res);
  }

  async insDicDatas(dtos: dicDataInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<dicDataDto>('sys_dic_data', dtos);
    return R.ok(res);
  }

  async updDicData(dto: dicDataUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<dicDataDto>('sys_dic_data', dto);
    return R.ok(res);
  }

  async updDicDatas(dtos: dicDataUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<dicDataDto>('sys_dic_data', dtos);
    return R.ok(res);
  }

  async delDicData(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById<dicDataDto>('sys_dic_data', ids);
    return R.ok(res);
  }
}
