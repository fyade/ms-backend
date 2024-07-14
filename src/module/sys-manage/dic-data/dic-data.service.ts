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

  async selAll(dto: dicDataSelAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_dic_data', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'value', 'dicType', 'ifDefault', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_dic_data', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_dic_data', Number(id));
    return R.ok(res);
  }

  async insDicData(dto: dicDataInsOneDto): Promise<R> {
    const res = await this.prisma.create('sys_dic_data', dto);
    return R.ok(res);
  }

  async insDicDatas(dto: dicDataInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_dic_data', dto);
    return R.ok(res);
  }

  async updDicData(dto: dicDataUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_dic_data', dto);
    return R.ok(res);
  }

  async updDicDatas(dto: dicDataUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_dic_data', dto);
    return R.ok(res);
  }

  async delDicData(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_dic_data', ids);
    return R.ok(res);
  }
}
