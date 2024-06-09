import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { insOneDto, menuDto, selListDto, updOneDto } from './dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selMenu(dto: selListDto): Promise<R> {
    const res = await this.prisma.findAll<menuDto>('sys_menu', { data: dto, orderBy: true });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_menu', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById('sys_menu', Number(id));
    return R.ok(one);
  }

  async insMenu(dto: insOneDto): Promise<R> {
    await this.prisma.create('sys_menu', dto);
    return R.ok();
  }

  async insMenus(dtos: insOneDto[]): Promise<R> {
    await this.prisma.createMany('sys_menu', dtos);
    return R.ok();
  }

  async updMenu(dto: updOneDto): Promise<R> {
    if (dto.id === dto.parentId) {
      return R.err('父级菜单不可选自己！');
    }
    await this.prisma.updateById('sys_menu', dto);
    return R.ok();
  }

  async updMenus(dtos: updOneDto[]): Promise<R> {
    if (dtos.some(item => item.id === item.parentId)) {
      return R.err('父级菜单不可选自己！');
    }
    await this.prisma.updateMany('sys_menu', dtos);
    return R.ok();
  }

  async delMenu(ids: any[]): Promise<R> {
    await this.prisma.deleteById('sys_menu', ids);
    return R.ok();
  }
}
