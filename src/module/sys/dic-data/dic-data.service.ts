import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { dicDataDto, insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class DicDataService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDicData(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<dicDataDto, selListDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'value', 'type', 'if_default', 'if_disabled', 'order_num'],
    });
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

  async updDicData(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_dic_data', dto);
    return R.ok(res);
  }

  async delDicData(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_dic_data', ids);
    return R.ok(res);
  }
}
