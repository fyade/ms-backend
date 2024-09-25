import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InterfaceGroupService } from './interface-group.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { interfaceGroupSelListDto, interfaceGroupSelAllDto, interfaceGroupInsOneDto, interfaceGroupUpdOneDto } from './dto';

@Controller('/sys-manage/interface-group')
@ApiTags('系统管理/接口组')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class InterfaceGroupController {
  constructor(private readonly interfaceGroupService: InterfaceGroupService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:selList',
    label: '分页查询接口组',
  })
  async selInterfaceGroup(@Query() dto: interfaceGroupSelListDto): Promise<R> {
    return this.interfaceGroupService.selInterfaceGroup(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:selAll',
    label: '查询所有接口组',
  })
  async selAllInterfaceGroup(@Query() dto: interfaceGroupSelAllDto): Promise<R> {
    return this.interfaceGroupService.selAllInterfaceGroup(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个接口组（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:selOnes',
    label: '查询多个接口组（根据id）',
  })
  async selOnesInterfaceGroup(@Query() ids: number[]): Promise<R> {
    return this.interfaceGroupService.selOnesInterfaceGroup(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:selOne',
    label: '查询单个接口组',
  })
  async selOneInterfaceGroup(@Param('id') id: number): Promise<R> {
    return this.interfaceGroupService.selOneInterfaceGroup(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:ins',
    label: '新增接口组',
  })
  async insInterfaceGroup(@Body() dto: interfaceGroupInsOneDto): Promise<R> {
    return this.interfaceGroupService.insInterfaceGroup(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增接口组',
  })
  @ApiBody({
    isArray: true,
    type: interfaceGroupInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:inss',
    label: '批量新增接口组',
  })
  async insInterfaceGroups(@Body(
    new ParseArrayPipe({
      items: interfaceGroupInsOneDto,
    }),
  ) dtos: interfaceGroupInsOneDto[]): Promise<R> {
    return this.interfaceGroupService.insInterfaceGroups(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:upd',
    label: '修改接口组',
  })
  async updInterfaceGroup(@Body() dto: interfaceGroupUpdOneDto): Promise<R> {
    return this.interfaceGroupService.updInterfaceGroup(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改接口组',
  })
  @ApiBody({
    isArray: true,
    type: interfaceGroupUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:upds',
    label: '批量修改接口组',
  })
  async updInterfaceGroups(@Body(
    new ParseArrayPipe({
      items: interfaceGroupUpdOneDto,
    }),
  ) dtos: interfaceGroupUpdOneDto[]): Promise<R> {
    return this.interfaceGroupService.updInterfaceGroups(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除接口组',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:interfaceGroup:del',
    label: '删除接口组',
  })
  async delInterfaceGroup(@Body() ids: number[]): Promise<R> {
    return this.interfaceGroupService.delInterfaceGroup(ids);
  }
}
