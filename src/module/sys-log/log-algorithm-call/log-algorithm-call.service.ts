import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import {
  logAlgorithmCallDto,
  logAlgorithmCallInsOneDto,
  logAlgorithmCallSelAllDto,
  logAlgorithmCallSelListDto,
  logAlgorithmCallUpdOneDto,
} from './dto';

@Injectable()
export class LogAlgorithmCallService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selLogAlgorithmCall(dto: logAlgorithmCallSelListDto): Promise<R> {
    const res = await this.prisma.findPage<logAlgorithmCallDto, logAlgorithmCallSelListDto>('log_algorithm_call', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'callIp', 'ifSuccess'],
      numberKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selAllLogAlgorithmCall(dto: logAlgorithmCallSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<logAlgorithmCallDto>('log_algorithm_call', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'callIp', 'ifSuccess'],
      numberKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOnesLogAlgorithmCall(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<logAlgorithmCallDto>('log_algorithm_call', Object.values(ids).map(n => Number(n)), {
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOneLogAlgorithmCall(id: number): Promise<R> {
    const res = await this.prisma.findById<logAlgorithmCallDto>('log_algorithm_call', Number(id), {
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async insLogAlgorithmCall(dto: logAlgorithmCallInsOneDto): Promise<R> {
    const res = await this.prisma.create<logAlgorithmCallDto>('log_algorithm_call', dto, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async insLogAlgorithmCalls(dtos: logAlgorithmCallInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<logAlgorithmCallDto>('log_algorithm_call', dtos, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogAlgorithmCall(dto: logAlgorithmCallUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<logAlgorithmCallDto>('log_algorithm_call', dto, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogAlgorithmCalls(dtos: logAlgorithmCallUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<logAlgorithmCallDto>('log_algorithm_call', dtos, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async delLogAlgorithmCall(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<logAlgorithmCallDto>('log_algorithm_call', ids);
    return R.ok(res);
  }
}
