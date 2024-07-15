import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { menuDto, menuInsOneDto, menuSelAllDto, menuUpdOneDto } from './dto';
import { CachePermissionService } from '../../cache/cache.permission.service';

@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
  }

  async selAll(dto: menuSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<menuDto>('sys_menu', {
      data: dto,
      orderBy: true,
      notNullKeys: ['label', 'type', 'path', 'parentId', 'component', 'icon', 'orderNum', 'ifLink', 'ifVisible', 'ifDisabled', 'ifPublic', 'perms'],
      numberKeys: ['parentId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds<menuDto>('sys_menu', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById<menuDto>('sys_menu', Number(id));
    return R.ok(one);
  }

  async insMenu(dto: menuInsOneDto): Promise<R> {
    await this.prisma.create<menuDto>('sys_menu', dto);
    return R.ok();
  }

  async insMenus(dtos: menuInsOneDto[]): Promise<R> {
    await this.prisma.createMany<menuDto>('sys_menu', dtos);
    return R.ok();
  }

  async updMenu(dto: menuUpdOneDto): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    if (dto.id === dto.parentId) {
      return R.err('父级菜单不可选自己！');
    }
    await this.prisma.updateById<menuDto>('sys_menu', dto);
    return R.ok();
  }

  async updMenus(dtos: menuUpdOneDto[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    if (dtos.some(item => item.id === item.parentId)) {
      return R.err('父级菜单不可选自己！');
    }
    await this.prisma.updateMany<menuDto>('sys_menu', dtos);
    return R.ok();
  }

  async delMenu(ids: any[]): Promise<R> {
    await this.cachePermissionService.clearPermissionsInCache();
    await this.prisma.deleteById<menuDto>('sys_menu', ids);
    return R.ok();
  }
}
