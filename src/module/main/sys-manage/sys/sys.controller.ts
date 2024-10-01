import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SysService } from './sys.service';
import { Authorize } from '../../../../decorator/authorizeDecorator';
import { R } from '../../../../common/R';
import { ValidationPipe } from '../../../../pipe/validation/validation.pipe';
import { sysSelListDto, sysSelAllDto, sysInsOneDto, sysUpdOneDto } from './dto';

@Controller('/sys-manage/sys')
@ApiTags('系统管理/系统')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class SysController {
  constructor(private readonly sysService: SysService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询系统',
  })
  @Authorize({
    permission: 'sysManage:sys:selList',
    label: '分页查询系统',
  })
  async selSys(@Query() dto: sysSelListDto): Promise<R> {
    return this.sysService.selSys(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有系统',
  })
  @Authorize({
    permission: 'sysManage:sys:selAll',
    label: '查询所有系统',
  })
  async selAllSys(@Query() dto: sysSelAllDto): Promise<R> {
    return this.sysService.selAllSys(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个系统（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:sys:selOnes',
    label: '查询多个系统（根据id）',
  })
  async selOnesSys(@Query() ids: number[]): Promise<R> {
    return this.sysService.selOnesSys(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个系统',
  })
  @Authorize({
    permission: 'sysManage:sys:selOne',
    label: '查询单个系统',
  })
  async selOneSys(@Param('id') id: number): Promise<R> {
    return this.sysService.selOneSys(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增系统',
  })
  @Authorize({
    permission: 'sysManage:sys:ins',
    label: '新增系统',
  })
  async insSys(@Body() dto: sysInsOneDto): Promise<R> {
    return this.sysService.insSys(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增系统',
  })
  @ApiBody({
    isArray: true,
    type: sysInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:sys:inss',
    label: '批量新增系统',
  })
  async insSyss(@Body(
    new ParseArrayPipe({
      items: sysInsOneDto,
    }),
  ) dtos: sysInsOneDto[]): Promise<R> {
    return this.sysService.insSyss(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改系统',
  })
  @Authorize({
    permission: 'sysManage:sys:upd',
    label: '修改系统',
  })
  async updSys(@Body() dto: sysUpdOneDto): Promise<R> {
    return this.sysService.updSys(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改系统',
  })
  @ApiBody({
    isArray: true,
    type: sysUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:sys:upds',
    label: '批量修改系统',
  })
  async updSyss(@Body(
    new ParseArrayPipe({
      items: sysUpdOneDto,
    }),
  ) dtos: sysUpdOneDto[]): Promise<R> {
    return this.sysService.updSyss(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除系统',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:sys:del',
    label: '删除系统',
  })
  async delSys(@Body() ids: number[]): Promise<R> {
    return this.sysService.delSys(ids);
  }
}
