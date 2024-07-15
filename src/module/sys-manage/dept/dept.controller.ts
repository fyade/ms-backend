import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeptService } from './dept.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { deptSelListDto, deptSelAllDto, deptInsOneDto, deptUpdOneDto } from './dto';

@Controller('/sys-manage/dept')
@ApiTags('部门')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class DeptController {
  constructor(private readonly deptService: DeptService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询部门',
  })
  @Authorize({
    permission: 'sysManage:dept:selList',
    label: '分页查询部门',
  })
  async selDept(@Query() dto: deptSelListDto): Promise<R> {
    return this.deptService.selDept(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有部门',
  })
  @Authorize({
    permission: 'sysManage:dept:selAll',
    label: '查询所有部门',
  })
  async selAll(@Query() dto: deptSelAllDto): Promise<R> {
    return this.deptService.selAll(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个部门（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:dept:selOnes',
    label: '查询多个部门（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.deptService.selOnes(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个部门',
  })
  @Authorize({
    permission: 'sysManage:dept:selOne',
    label: '查询单个部门',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.deptService.selOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增部门',
  })
  @Authorize({
    permission: 'sysManage:dept:ins',
    label: '新增部门',
  })
  async insDept(@Body() dto: deptInsOneDto): Promise<R> {
    return this.deptService.insDept(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增部门',
  })
  @ApiBody({
    isArray: true,
    type: deptInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:dept:inss',
    label: '批量新增部门',
  })
  async insDepts(@Body(
    new ParseArrayPipe({
      items: deptInsOneDto,
    }),
  ) dtos: deptInsOneDto[]): Promise<R> {
    return this.deptService.insDepts(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改部门',
  })
  @Authorize({
    permission: 'sysManage:dept:upd',
    label: '修改部门',
  })
  async updDept(@Body() dto: deptUpdOneDto): Promise<R> {
    return this.deptService.updDept(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改部门',
  })
  @ApiBody({
    isArray: true,
    type: deptUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:dept:upds',
    label: '批量修改部门',
  })
  async updDepts(@Body(
    new ParseArrayPipe({
      items: deptUpdOneDto,
    }),
  ) dtos: deptUpdOneDto[]): Promise<R> {
    return this.deptService.updDepts(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除部门',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:dept:del',
    label: '删除部门',
  })
  async delDept(@Body() ids: any[]): Promise<R> {
    return this.deptService.delDept(ids);
  }
}
