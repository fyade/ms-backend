import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { LogAlgorithmCallDto, LogAlgorithmCallSelListDto, LogAlgorithmCallSelAllDto, LogAlgorithmCallInsOneDto, LogAlgorithmCallUpdOneDto } from './dto';

@Injectable()
export class LogAlgorithmCallService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selLogAlgorithmCall(dto: LogAlgorithmCallSelListDto): Promise<R> {
    const res = await this.prisma.findPage<LogAlgorithmCallDto, LogAlgorithmCallSelListDto>('log_algorithm_call', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userGroupPermissionId', 'userId', 'callIp', 'ifSuccess', 'loginRole'],
      numberKeys: ['userGroupPermissionId'],
      completeMatchingKeys: ['userGroupPermissionId', 'userId', 'loginRole'],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selAllLogAlgorithmCall(dto: LogAlgorithmCallSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<LogAlgorithmCallDto>('log_algorithm_call', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userGroupPermissionId', 'userId', 'callIp', 'ifSuccess', 'loginRole'],
      numberKeys: ['userGroupPermissionId'],
      completeMatchingKeys: ['userGroupPermissionId', 'userId', 'loginRole'],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOnesLogAlgorithmCall(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<LogAlgorithmCallDto>('log_algorithm_call', Object.values(ids).map(n => Number(n)), {
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOneLogAlgorithmCall(id: number): Promise<R> {
    const res = await this.prisma.findById<LogAlgorithmCallDto>('log_algorithm_call', Number(id), {
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async insLogAlgorithmCall(dto: LogAlgorithmCallInsOneDto): Promise<R> {
    const res = await this.prisma.create<LogAlgorithmCallDto>('log_algorithm_call', dto, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async insLogAlgorithmCalls(dtos: LogAlgorithmCallInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<LogAlgorithmCallDto>('log_algorithm_call', dtos, {
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogAlgorithmCall(dto: LogAlgorithmCallUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<LogAlgorithmCallDto>('log_algorithm_call', dto, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async updLogAlgorithmCalls(dtos: LogAlgorithmCallUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<LogAlgorithmCallDto>('log_algorithm_call', dtos, {
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async delLogAlgorithmCall(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<LogAlgorithmCallDto>('log_algorithm_call', ids);
    return R.ok(res);
  }
}
