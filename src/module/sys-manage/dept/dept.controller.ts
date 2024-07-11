import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeptService } from './dept.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/dept')
@ApiTags('部门表')
@UsePipes(new ValidationPipe())
export class DeptController {
  constructor(private readonly deptService: DeptService) {
  }

  @Get()
  @Authorize({
    permission: 'sysManage:dept:selList',
    label: '分页查询部门',
  })
  async selDept(@Query() dto: selListDto): Promise<R> {
    return this.deptService.selDept(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:dept:selAll',
    label: '查询所有部门',
  })
  async selAll(@Query() dto: selAllDto) {
    return this.deptService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysManage:dept:selOnes',
    label: '查询多个部门（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.deptService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:dept:selOne',
    label: '查询单个部门',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.deptService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysManage:dept:ins',
    label: '新增部门',
  })
  async insDept(@Body() dto: insOneDto): Promise<R> {
    return this.deptService.insDept(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysManage:dept:inss',
    label: '批量新增部门',
  })
  async insDepts(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.deptService.insDepts(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysManage:dept:upd',
    label: '修改部门',
  })
  async updDept(@Body() dto: updOneDto): Promise<R> {
    return this.deptService.updDept(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysManage:dept:upds',
    label: '批量修改部门',
  })
  async updDepts(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.deptService.updDepts(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:dept:del',
    label: '删除部门',
  })
  async delDept(@Body() ids: any[]): Promise<R> {
    return this.deptService.delDept(ids);
  }
}
