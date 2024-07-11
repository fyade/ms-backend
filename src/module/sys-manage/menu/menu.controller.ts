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
  @Authorize({
    permission: 'sysManage:menu:selAll',
    label: '查询所有菜单',
  })
  async selAll(@Query() dto: selAllDto): Promise<R> {
    return this.menuService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysManage:menu:selOnes',
    label: '查询多个菜单（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.menuService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:menu:selOne',
    label: '查询单个菜单',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.menuService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysManage:menu:ins',
    label: '新增菜单',
  })
  async insMenu(@Body() dto: insOneDto): Promise<R> {
    return this.menuService.insMenu(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysManage:menu:inss',
    label: '批量新增菜单',
  })
  async insMenus(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.menuService.insMenus(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysManage:menu:upd',
    label: '修改菜单',
  })
  async updMenu(@Body() dto: updOneDto): Promise<R> {
    return this.menuService.updMenu(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysManage:menu:upds',
    label: '批量修改菜单',
  })
  async updMenus(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.menuService.updMenus(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:menu:del',
    label: '删除菜单',
  })
  async delMenu(@Body() ids: any[]): Promise<R> {
    return this.menuService.delMenu(ids);
  }
}
