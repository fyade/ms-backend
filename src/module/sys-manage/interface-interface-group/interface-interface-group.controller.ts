import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InterfaceInterfaceGroupService } from './interface-interface-group.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import {
  interfaceInterfaceGroupSelListDto,
  interfaceInterfaceGroupSelAllDto,
  interfaceInterfaceGroupInsOneDto,
  interfaceInterfaceGroupUpdOneDto,
  interfaceInterfaceGroupUpdIIGDto, interfaceInterfaceGroupUpdIGIDto,
} from './dto';

@Controller('/sys-manage/interface-interface-group')
@ApiTags('接口接口组')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class InterfaceInterfaceGroupController {
  constructor(private readonly interfaceInterfaceGroupService: InterfaceInterfaceGroupService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询接口接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceInterfaceGroup:selList',
    label: '分页查询接口接口组',
  })
  async selInterfaceInterfaceGroup(@Query() dto: interfaceInterfaceGroupSelListDto): Promise<R> {
    return this.interfaceInterfaceGroupService.selInterfaceInterfaceGroup(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有接口接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceInterfaceGroup:selAll',
    label: '查询所有接口接口组',
  })
  async selAll(@Query() dto: interfaceInterfaceGroupSelAllDto): Promise<R> {
    return this.interfaceInterfaceGroupService.selAll(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个接口接口组（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:interfaceInterfaceGroup:selOnes',
    label: '查询多个接口接口组（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.interfaceInterfaceGroupService.selOnes(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个接口接口组',
  })
  @Authorize({
    permission: 'sysManage:interfaceInterfaceGroup:selOne',
    label: '查询单个接口接口组',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.interfaceInterfaceGroupService.selOne(id);
  }

  @Post('/iig')
  @ApiOperation({
    summary: '更新接口接口组（iig）',
  })
  @Authorize({
    permission: 'sysManage:interfaceInterfaceGroup:updIig',
    label: '更新接口接口组（iig）',
  })
  async updInterfaceInterfaceGroupIIG(@Body() dto: interfaceInterfaceGroupUpdIIGDto): Promise<R> {
    return this.interfaceInterfaceGroupService.updInterfaceInterfaceGroupIIG(dto);
  }

  @Post('/igi')
  @ApiOperation({
    summary: '更新接口接口组（igi）',
  })
  @Authorize({
    permission: 'sysManage:interfaceInterfaceGroup:updIgi',
    label: '更新接口接口组（igi）',
  })
  async updInterfaceInterfaceGroupIGI(@Body() dto: interfaceInterfaceGroupUpdIGIDto): Promise<R> {
    return this.interfaceInterfaceGroupService.updInterfaceInterfaceGroupIGI(dto);
  }

  @Delete()
  @ApiOperation({
    summary: '删除接口接口组',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:interfaceInterfaceGroup:del',
    label: '删除接口接口组',
  })
  async delInterfaceInterfaceGroup(@Body() ids: any[]): Promise<R> {
    return this.interfaceInterfaceGroupService.delInterfaceInterfaceGroup(ids);
  }
}
