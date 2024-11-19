import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { MenuIpWhiteListDto, MenuIpWhiteListSelListDto, MenuIpWhiteListSelAllDto, MenuIpWhiteListInsOneDto, MenuIpWhiteListUpdOneDto } from './dto';

@Injectable()
export class MenuIpWhiteListService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selMenuIpWhiteList(dto: MenuIpWhiteListSelListDto): Promise<R> {
    const res = await this.prisma.findPage<MenuIpWhiteListDto, MenuIpWhiteListSelListDto>('sys_menu_ip_white_list', {
      data: dto,
      orderBy: false,
      notNullKeys: ['menuId', 'ipWhiteList', 'type'],
      numberKeys: ['menuId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selAllMenuIpWhiteList(dto: MenuIpWhiteListSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<MenuIpWhiteListDto>('sys_menu_ip_white_list', {
      data: dto,
      orderBy: false,
      notNullKeys: ['menuId', 'ipWhiteList', 'type'],
      numberKeys: ['menuId'],
      completeMatchingKeys: [],
    });
    return R.ok(res);
  }

  async selOnesMenuIpWhiteList(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<MenuIpWhiteListDto>('sys_menu_ip_white_list', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneMenuIpWhiteList(id: number): Promise<R> {
    const res = await this.prisma.findById<MenuIpWhiteListDto>('sys_menu_ip_white_list', Number(id));
    return R.ok(res);
  }

  async insMenuIpWhiteList(dto: MenuIpWhiteListInsOneDto): Promise<R> {
    const res = await this.prisma.create<MenuIpWhiteListDto>('sys_menu_ip_white_list', dto);
    return R.ok(res);
  }

  async insMenuIpWhiteLists(dtos: MenuIpWhiteListInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<MenuIpWhiteListDto>('sys_menu_ip_white_list', dtos);
    return R.ok(res);
  }

  async updMenuIpWhiteList(dto: MenuIpWhiteListUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<MenuIpWhiteListDto>('sys_menu_ip_white_list', dto);
    return R.ok(res);
  }

  async updMenuIpWhiteLists(dtos: MenuIpWhiteListUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<MenuIpWhiteListDto>('sys_menu_ip_white_list', dtos);
    return R.ok(res);
  }

  async delMenuIpWhiteList(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<MenuIpWhiteListDto>('sys_menu_ip_white_list', ids);
    return R.ok(res);
  }
}
