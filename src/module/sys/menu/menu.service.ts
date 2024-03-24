import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { insOneDto, menuDto, selListDto, updOneDto } from './dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selMenu(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage_<menuDto, selListDto>('sys_menu', dto);
    res.list.sort((a, b) => a.order_num - b.order_num);
    return R.ok(res);
  }

  async selOne(id: any): Promise<R> {
    const one = await this.prisma.findById_('sys_menu', Number(id));
    return R.ok(one);
  }

  async insMenu(dto: insOneDto): Promise<R> {
    await this.prisma.create_('sys_menu', dto);
    return R.ok();
  }

  async updMenu(dto: updOneDto): Promise<R> {
    await this.prisma.updateById_('sys_menu', dto);
    return R.ok();
  }

  async delMenu(ids: any[]): Promise<R> {
    await this.prisma.deleteById_('sys_menu', ids);
    return R.ok();
  }
}
