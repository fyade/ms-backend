import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { DicDataDto, DicDataSelListDto, DicDataSelAllDto, DicDataInsOneDto, DicDataUpdOneDto } from './dto';
import { DicTypeDto } from '../dic-type/dto';

@Injectable()
export class DicDataService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selDicDataOfType(perm: string): Promise<R> {
    const dicTypeDto = await this.prisma.findFirst<DicTypeDto>('sys_dic_type', { type: perm });
    const ret = [];
    if (dicTypeDto) {
      const dicDataDtos = await this.prisma.findAll<DicDataDto>('sys_dic_data', {
        data: { dicTypeId: dicTypeDto.id },
        notNullKeys: ['dicTypeId'],
        numberKeys: ['dicTypeId'],
      });
      ret.push(...dicDataDtos);
    }
    return R.ok(ret);
  }

  async selDicData(dto: DicDataSelListDto): Promise<R> {
    const res = await this.prisma.findPage<DicDataDto, DicDataSelListDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'value', 'dicTypeId', 'ifDefault', 'ifDisabled', 'orderNum'],
      numberKeys: ['dicTypeId', 'orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllDicData(dto: DicDataSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<DicDataDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'value', 'dicTypeId', 'ifDefault', 'ifDisabled', 'orderNum'],
      numberKeys: ['dicTypeId', 'orderNum'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesDicData(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<DicDataDto>('sys_dic_data', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneDicData(id: number): Promise<R> {
    const res = await this.prisma.findById<DicDataDto>('sys_dic_data', Number(id));
    return R.ok(res);
  }

  async insDicData(dto: DicDataInsOneDto): Promise<R> {
    const res = await this.prisma.create<DicDataDto>('sys_dic_data', dto);
    return R.ok(res);
  }

  async insDicDatas(dtos: DicDataInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<DicDataDto>('sys_dic_data', dtos);
    return R.ok(res);
  }

  async updDicData(dto: DicDataUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<DicDataDto>('sys_dic_data', dto);
    return R.ok(res);
  }

  async updDicDatas(dtos: DicDataUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<DicDataDto>('sys_dic_data', dtos);
    return R.ok(res);
  }

  async delDicData(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<DicDataDto>('sys_dic_data', ids);
    return R.ok(res);
  }
}
