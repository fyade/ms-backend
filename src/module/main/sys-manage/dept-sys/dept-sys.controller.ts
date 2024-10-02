import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeptSysService } from './dept-sys.service';
import { Authorize } from '../../../../decorator/authorizeDecorator';
import { R } from '../../../../common/R';
import { ValidationPipe } from '../../../../pipe/validation/validation.pipe';
import { deptSysSelListDto, deptSysSelAllDto, deptSysInsOneDto, deptSysUpdOneDto } from './dto';

@Controller('/main/sys-manage/dept-sys')
@ApiTags('部门系统')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class DeptSysController {
  constructor(private readonly deptSysService: DeptSysService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询部门系统',
  })
  @Authorize({
    permission: 'sysManage:deptSys:selList',
    label: '分页查询部门系统',
  })
  async selDeptSys(@Query() dto: deptSysSelListDto): Promise<R> {
    return this.deptSysService.selDeptSys(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有部门系统',
  })
  @Authorize({
    permission: 'sysManage:deptSys:selAll',
    label: '查询所有部门系统',
  })
  async selAllDeptSys(@Query() dto: deptSysSelAllDto): Promise<R> {
    return this.deptSysService.selAllDeptSys(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个部门系统（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:deptSys:selOnes',
    label: '查询多个部门系统（根据id）',
  })
  async selOnesDeptSys(@Query() ids: number[]): Promise<R> {
    return this.deptSysService.selOnesDeptSys(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个部门系统',
  })
  @Authorize({
    permission: 'sysManage:deptSys:selOne',
    label: '查询单个部门系统',
  })
  async selOneDeptSys(@Param('id') id: number): Promise<R> {
    return this.deptSysService.selOneDeptSys(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增部门系统',
  })
  @Authorize({
    permission: 'sysManage:deptSys:ins',
    label: '新增部门系统',
  })
  async insDeptSys(@Body() dto: deptSysInsOneDto): Promise<R> {
    return this.deptSysService.insDeptSys(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增部门系统',
  })
  @ApiBody({
    isArray: true,
    type: deptSysInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:deptSys:inss',
    label: '批量新增部门系统',
  })
  async insDeptSyss(@Body(
    new ParseArrayPipe({
      items: deptSysInsOneDto,
    }),
  ) dtos: deptSysInsOneDto[]): Promise<R> {
    return this.deptSysService.insDeptSyss(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改部门系统',
  })
  @Authorize({
    permission: 'sysManage:deptSys:upd',
    label: '修改部门系统',
  })
  async updDeptSys(@Body() dto: deptSysUpdOneDto): Promise<R> {
    return this.deptSysService.updDeptSys(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改部门系统',
  })
  @ApiBody({
    isArray: true,
    type: deptSysUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:deptSys:upds',
    label: '批量修改部门系统',
  })
  async updDeptSyss(@Body(
    new ParseArrayPipe({
      items: deptSysUpdOneDto,
    }),
  ) dtos: deptSysUpdOneDto[]): Promise<R> {
    return this.deptSysService.updDeptSyss(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除部门系统',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:deptSys:del',
    label: '删除部门系统',
  })
  async delDeptSys(@Body() ids: number[]): Promise<R> {
    return this.deptSysService.delDeptSys(ids);
  }
}
