import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { dicDataDto, insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class DicDataService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDicData(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<dicDataDto, selListDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'value', 'type', 'ifDefault', 'ifDisabled', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_dic_data', { data: dto });
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

  async insDicData(dto: insOneDto): Promise<R> {
    const res = await this.prisma.create('sys_dic_data', dto);
    return R.ok(res);
  }

  async insDicDatas(dto: insOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_dic_data', dto);
    return R.ok(res);
  }

  async updDicData(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_dic_data', dto);
    return R.ok(res);
  }

  async updDicDatas(dto: updOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_dic_data', dto);
    return R.ok(res);
  }

  async delDicData(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_dic_data', ids);
    return R.ok(res);
  }
}
