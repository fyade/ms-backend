import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selListDto, updOneDto } from './dto';

@Controller('/sys/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {
  }

  @Get()
  @Authorize('system:menu:selAll')
  async selMenu(@Query() dto: selListDto): Promise<R> {
    return this.menuService.selMenu(dto);
  }

  @Get('/:id')
  @Authorize('system:menu:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.menuService.selOne(id);
  }

  @Post()
  @Authorize('system:menu:ins')
  async insMenu(@Body() dto: insOneDto): Promise<R> {
    return this.menuService.insMenu(dto);
  }

  @Put()
  @Authorize('system:menu:upd')
  async updMenu(@Body() dto: updOneDto): Promise<R> {
    return this.menuService.updMenu(dto);
  }

  @Delete()
  @Authorize('system:menu:del')
  async delMenu(@Body() ids: any[]): Promise<R> {
    return this.menuService.delMenu(ids);
  }
}
