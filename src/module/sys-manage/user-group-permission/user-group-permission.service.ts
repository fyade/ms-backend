import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import {
  userGroupPermissionDto,
  userGroupPermissionSelListDto,
  userGroupPermissionSelAllDto,
  userGroupPermissionInsOneDto,
  userGroupPermissionUpdOneDto,
} from './dto';
import { base } from '../../../util/base';

@Injectable()
export class UserGroupPermissionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selUserGroupPermission(dto: userGroupPermissionSelListDto): Promise<R> {
    const res = await this.prisma.findPage<userGroupPermissionDto, userGroupPermissionSelListDto>('sys_user_group_permission', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userGroupId', 'permissionId'],
      numberKeys: ['userGroupId', 'permissionId'],
    });
    return R.ok(res);
  }

  async selAll(dto: userGroupPermissionSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<userGroupPermissionDto>('sys_user_group_permission', {
      data: dto,
      orderBy: false,
      notNullKeys: ['userGroupId', 'permissionId'],
      numberKeys: ['userGroupId', 'permissionId'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds<userGroupPermissionDto>('sys_user_group_permission', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById<userGroupPermissionDto>('sys_user_group_permission', Number(id));
    return R.ok(res);
  }

  async insUserGroupPermission(dto: userGroupPermissionInsOneDto): Promise<R> {
    dto.ifUseUp = base.N;
    const res = await this.prisma.create<userGroupPermissionDto>('sys_user_group_permission', dto);
    return R.ok(res);
  }

  // async insUserGroupPermissions(dtos: userGroupPermissionInsOneDto[]): Promise<R> {
  //   dtos.forEach(dto => {
  //     dto.ifUseUp = base.N;
  //   });
  //   const res = await this.prisma.createMany<userGroupPermissionDto>('sys_user_group_permission', dtos);
  //   return R.ok(res);
  // }
  //
  // async updUserGroupPermission(dto: userGroupPermissionUpdOneDto): Promise<R> {
  //   dto.ifUseUp = base.N;
  //   const res = await this.prisma.updateById<userGroupPermissionDto>('sys_user_group_permission', dto);
  //   return R.ok(res);
  // }
  //
  // async updUserGroupPermissions(dtos: userGroupPermissionUpdOneDto[]): Promise<R> {
  //   dtos.forEach(dto => {
  //     dto.ifUseUp = base.N;
  //   });
  //   const res = await this.prisma.updateMany<userGroupPermissionDto>('sys_user_group_permission', dtos);
  //   return R.ok(res);
  // }

  async delUserGroupPermission(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById<userGroupPermissionDto>('sys_user_group_permission', ids);
    return R.ok(res);
  }
}
