import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { MenuService } from './menu.service';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, updOneDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/menu')
@ApiTags('菜单')
@UsePipes(new ValidationPipe())
export class MenuController {
  constructor(private readonly menuService: MenuService) {
  }

  @Get('/all')
  @Authorize('sysManage:menu:selAll')
  async selAll(@Query() dto: selAllDto): Promise<R> {
    return this.menuService.selAll(dto);
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
  async insMenus(@Body(
    new ParseArrayPipe({
      items: insOneDto
    })
  ) dto: insOneDto[]): Promise<R> {
    return this.menuService.insMenus(dto);
  }

  @Put()
  @Authorize('sysManage:menu:upd')
  async updMenu(@Body() dto: updOneDto): Promise<R> {
    return this.menuService.updMenu(dto);
  }

  @Put('/s')
  @Authorize('sysManage:menu:upds')
  async updMenus(@Body(
    new ParseArrayPipe({
      items: updOneDto
    })
  ) dto: updOneDto[]): Promise<R> {
    return this.menuService.updMenus(dto);
  }

  @Delete()
  @Authorize('sysManage:menu:del')
  async delMenu(@Body() ids: any[]): Promise<R> {
    return this.menuService.delMenu(ids);
  }
}
