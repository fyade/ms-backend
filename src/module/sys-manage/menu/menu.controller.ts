import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selListDto, updOneDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sys-manage/menu')
@ApiTags('菜单')
export class MenuController {
  constructor(private readonly menuService: MenuService) {
  }

  @Get('/all')
  @Authorize('sysManage:menu:selAll')
  async selMenu(@Query() dto: selListDto): Promise<R> {
    return this.menuService.selMenu(dto);
  }

  @Get('/ids')
  @Authorize('sysManage:menu:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.menuService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('sysManage:menu:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.menuService.selOne(id);
  }

  @Post()
  @Authorize('sysManage:menu:ins')
  async insMenu(@Body() dto: insOneDto): Promise<R> {
    return this.menuService.insMenu(dto);
  }

  @Post('/s')
  @Authorize('sysManage:menu:inss')
  async insMenus(@Body() dto: insOneDto[]): Promise<R> {
    return this.menuService.insMenus(dto);
  }

  @Put()
  @Authorize('sysManage:menu:upd')
  async updMenu(@Body() dto: updOneDto): Promise<R> {
    return this.menuService.updMenu(dto);
  }

  @Put('/s')
  @Authorize('sysManage:menu:upds')
  async updMenus(@Body() dto: updOneDto[]): Promise<R> {
    return this.menuService.updMenus(dto);
  }

  @Delete()
  @Authorize('sysManage:menu:del')
  async delMenu(@Body() ids: any[]): Promise<R> {
    return this.menuService.delMenu(ids);
  }
}
