import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { LogUserLoginDto, LogUserLoginSelListDto, LogUserLoginSelAllDto, LogUserLoginInsOneDto, LogUserLoginUpdOneDto } from './dto';

@Injectable()
export class LogUserLoginService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selLogUserLogin(dto: LogUserLoginSelListDto): Promise<R> {
    const res = await this.prisma.findPage<LogUserLoginDto, LogUserLoginSelListDto>('log_user_login', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'ifSuccess'],
      numberKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selAllLogUserLogin(dto: LogUserLoginSelAllDto, {
                 orderBy = false,
                 range = {},
               }: {
                 orderBy?: boolean | object,
                 range?: object
               } = {},
  ): Promise<R> {
    const res = await this.prisma.findAll<LogUserLoginDto>('log_user_login', {
      data: dto,
      orderBy,
      range,
      notNullKeys: ['userId', 'ifSuccess'],
      numberKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOnesLogUserLogin(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<LogUserLoginDto>('log_user_login', Object.values(ids).map(n => Number(n)), { ifDeleted: false });
    return R.ok(res);
  }

  async selOneLogUserLogin(id: number): Promise<R> {
    const res = await this.prisma.findById<LogUserLoginDto>('log_user_login', Number(id), { ifDeleted: false });
    return R.ok(res);
  }

  async insLogUserLogin(dto: LogUserLoginInsOneDto, {
    ifCustomizeId = false,
    ifCreateBy = true,
    ifUpdateBy = true,
    ifCreateTime = true,
    ifUpdateTime = true,
    ifDeleted = true,
  }: {
    ifCustomizeId?: boolean,
    ifCreateBy?: boolean,
    ifUpdateBy?: boolean,
    ifCreateTime?: boolean,
    ifUpdateTime?: boolean,
    ifDeleted?: boolean,
  } = {}): Promise<R> {
    const res = await this.prisma.create<LogUserLoginDto>('log_user_login', dto, {
      ifCustomizeId,
      ifCreateBy,
      ifUpdateBy,
      ifCreateTime,
      ifUpdateTime,
      ifDeleted,
    });
    return R.ok(res);
  }

  async insLogUserLogins(dtos: LogUserLoginInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<LogUserLoginDto>('log_user_login', dtos);
    return R.ok(res);
  }

  async updLogUserLogin(dto: LogUserLoginUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<LogUserLoginDto>('log_user_login', dto, { ifDeleted: false });
    return R.ok(res);
  }

  async updLogUserLogins(dtos: LogUserLoginUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<LogUserLoginDto>('log_user_login', dtos, { ifDeleted: false });
    return R.ok(res);
  }

  async delLogUserLogin(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<LogUserLoginDto>('log_user_login', ids);
    return R.ok(res);
  }
}
