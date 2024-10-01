import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import {
  logOperationDto,
  logOperationSelListDto,
  logOperationSelAllDto,
  logOperationInsOneDto,
  logOperationUpdOneDto,
} from './dto';

@Injectable()
export class LogOperationService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selLogOperation(dto: logOperationSelListDto): Promise<R> {
    const res = await this.prisma.findPage<logOperationDto, logOperationSelListDto>('log_operation', {
      data: dto,
      orderBy: false,
      notNullKeys: ['perms', 'userId', 'reqParam', 'oldValue', 'operateType', 'ifSuccess'],
      numberKeys: [],
      completeMatchingKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selAllLogOperation(dto: logOperationSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<logOperationDto>('log_operation', {
      data: dto,
      orderBy: false,
      notNullKeys: ['perms', 'userId', 'reqParam', 'oldValue', 'operateType', 'ifSuccess'],
      numberKeys: [],
      completeMatchingKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOnesLogOperation(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<logOperationDto>('log_operation', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneLogOperation(id: number): Promise<R> {
    const res = await this.prisma.findById<logOperationDto>('log_operation', Number(id));
    return R.ok(res);
  }

  async insLogOperation(dto: logOperationInsOneDto): Promise<R> {
    const res = await this.prisma.create<logOperationDto>('log_operation', dto, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async insLogOperations(dtos: logOperationInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<logOperationDto>('log_operation', dtos, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogOperation(dto: logOperationUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<logOperationDto>('log_operation', dto, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogOperations(dtos: logOperationUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<logOperationDto>('log_operation', dtos, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async delLogOperation(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<logOperationDto>('log_operation', ids);
    return R.ok(res);
  }
}
