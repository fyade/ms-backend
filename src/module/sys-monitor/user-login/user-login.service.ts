import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { userLoginDto, insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class UserLoginService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selUserLogin(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<userLoginDto, selListDto>('log_user_login', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userId', 'ifSuccess'],
      numberKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto, {
                 orderBy = false,
                 range = {},
               }: {
                 orderBy?: boolean | object,
                 range?: object
               } = {},
  ): Promise<R> {
    const res = await this.prisma.findAll('log_user_login', {
      data: dto,
      orderBy,
      range,
      notNullKeys: ['userId', 'ifSuccess'],
      numberKeys: [],
      ifDeleted: false,
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('log_user_login', Object.values(ids).map(n => Number(n)), { ifDeleted: false });
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('log_user_login', Number(id), { ifDeleted: false });
    return R.ok(res);
  }

  async insUserLogin(dto: insOneDto, {
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
    const res = await this.prisma.create('log_user_login', dto, {
      ifCustomizeId,
      ifCreateBy,
      ifUpdateBy,
      ifCreateTime,
      ifUpdateTime,
      ifDeleted,
    });
    return R.ok(res);
  }

  async insUserLogins(dtos: insOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('log_user_login', dtos);
    return R.ok(res);
  }

  async updUserLogin(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('log_user_login', dto, { ifDeleted: false });
    return R.ok(res);
  }

  async updUserLogins(dtos: updOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('log_user_login', dtos, { ifDeleted: false });
    return R.ok(res);
  }

  async delUserLogin(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('log_user_login', ids);
    return R.ok(res);
  }
}
