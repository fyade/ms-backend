import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { MenuService } from './menu.service';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { menuInsOneDto, menuSelAllDto, menuUpdOneDto } from './dto';

@Controller('/sys-manage/menu')
@ApiTags('系统管理/菜单')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class MenuController {
  constructor(private readonly menuService: MenuService) {
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有菜单',
  })
  @Authorize({
    permission: 'sysManage:menu:selAll',
    label: '查询所有菜单',
  })
  async selAllMenu(@Query() dto: menuSelAllDto): Promise<R> {
    return this.menuService.selAllMenu(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个菜单（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:menu:selOnes',
    label: '查询多个菜单（根据id）',
  })
  async selOnesMenu(@Query() ids: number[]): Promise<R> {
    return this.menuService.selOnesMenu(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个菜单',
  })
  @Authorize({
    permission: 'sysManage:menu:selOne',
    label: '查询单个菜单',
  })
  async selOneMenu(@Param('id') id: number): Promise<R> {
    return this.menuService.selOneMenu(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增菜单',
  })
  @Authorize({
    permission: 'sysManage:menu:ins',
    label: '新增菜单',
  })
  async insMenu(@Body() dto: menuInsOneDto): Promise<R> {
    return this.menuService.insMenu(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增菜单',
  })
  @ApiBody({
    isArray: true,
    type: menuInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:menu:inss',
    label: '批量新增菜单',
  })
  async insMenus(@Body(
    new ParseArrayPipe({
      items: menuInsOneDto,
    }),
  ) dtos: menuInsOneDto[]): Promise<R> {
    return this.menuService.insMenus(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改菜单',
  })
  @Authorize({
    permission: 'sysManage:menu:upd',
    label: '修改菜单',
  })
  async updMenu(@Body() dto: menuUpdOneDto): Promise<R> {
    return this.menuService.updMenu(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改菜单',
  })
  @ApiBody({
    isArray: true,
    type: menuUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:menu:upds',
    label: '批量修改菜单',
  })
  async updMenus(@Body(
    new ParseArrayPipe({
      items: menuUpdOneDto,
    }),
  ) dtos: menuUpdOneDto[]): Promise<R> {
    return this.menuService.updMenus(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除菜单',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:menu:del',
    label: '删除菜单',
  })
  async delMenu(@Body() ids: number[]): Promise<R> {
    return this.menuService.delMenu(ids);
  }
}
