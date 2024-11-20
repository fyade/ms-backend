import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { LogOperationDto, LogOperationSelListDto, LogOperationSelAllDto, LogOperationInsOneDto, LogOperationUpdOneDto } from './dto';

@Injectable()
export class LogOperationService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selLogOperation(dto: LogOperationSelListDto): Promise<R> {
    const res = await this.prisma.findPage<LogOperationDto, LogOperationSelListDto>('log_operation', {
      data: dto,
      orderBy: false,
      notNullKeys: ['reqId', 'callIp', 'hostName', 'perms', 'userId', 'reqParam', 'oldValue', 'operateType', 'ifSuccess'],
      numberKeys: [],
      completeMatchingKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selAllLogOperation(dto: LogOperationSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<LogOperationDto>('log_operation', {
      data: dto,
      orderBy: false,
      notNullKeys: ['reqId', 'callIp', 'hostName', 'perms', 'userId', 'reqParam', 'oldValue', 'operateType', 'ifSuccess'],
      numberKeys: [],
      completeMatchingKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOnesLogOperation(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<LogOperationDto>('log_operation', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneLogOperation(id: number): Promise<R> {
    const res = await this.prisma.findById<LogOperationDto>('log_operation', Number(id));
    return R.ok(res);
  }

  async insLogOperation(dto: LogOperationInsOneDto): Promise<R> {
    const res = await this.prisma.create<LogOperationDto>('log_operation', dto, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async insLogOperations(dtos: LogOperationInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<LogOperationDto>('log_operation', dtos, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogOperation(dto: LogOperationUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<LogOperationDto>('log_operation', dto, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogOperations(dtos: LogOperationUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<LogOperationDto>('log_operation', dtos, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async delLogOperation(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<LogOperationDto>('log_operation', ids);
    return R.ok(res);
  }
}
