import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DicTypeService } from './dic-type.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { dicTypeSelListDto, dicTypeSelAllDto, dicTypeInsOneDto, dicTypeUpdOneDto } from './dto';

@Controller('/sys-manage/dic-type')
@ApiTags('字典类型')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class DicTypeController {
  constructor(private readonly dicTypeService: DicTypeService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询字典类型',
  })
  @Authorize({
    permission: 'sysManage:dicType:selList',
    label: '分页查询字典类型',
  })
  async selDicType(@Query() dto: dicTypeSelListDto): Promise<R> {
    return this.dicTypeService.selDicType(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有字典类型',
  })
  @Authorize({
    permission: 'sysManage:dicType:selAll',
    label: '查询所有字典类型',
  })
  async selAll(@Query() dto: dicTypeSelAllDto): Promise<R> {
    return this.dicTypeService.selAll(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个字典类型（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:dicType:selOnes',
    label: '查询多个字典类型（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.dicTypeService.selOnes(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个字典类型',
  })
  @Authorize({
    permission: 'sysManage:dicType:selOne',
    label: '查询单个字典类型',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.dicTypeService.selOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增字典类型',
  })
  @Authorize({
    permission: 'sysManage:dicType:ins',
    label: '新增字典类型',
  })
  async insDicType(@Body() dto: dicTypeInsOneDto): Promise<R> {
    return this.dicTypeService.insDicType(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增字典类型',
  })
  @ApiBody({
    isArray: true,
    type: dicTypeInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:dicType:inss',
    label: '批量新增字典类型',
  })
  async insDicTypes(@Body(
    new ParseArrayPipe({
      items: dicTypeInsOneDto,
    }),
  ) dtos: dicTypeInsOneDto[]): Promise<R> {
    return this.dicTypeService.insDicTypes(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改字典类型',
  })
  @Authorize({
    permission: 'sysManage:dicType:upd',
    label: '修改字典类型',
  })
  async updDicType(@Body() dto: dicTypeUpdOneDto): Promise<R> {
    return this.dicTypeService.updDicType(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改字典类型',
  })
  @ApiBody({
    isArray: true,
    type: dicTypeUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:dicType:upds',
    label: '批量修改字典类型',
  })
  async updDicTypes(@Body(
    new ParseArrayPipe({
      items: dicTypeUpdOneDto,
    }),
  ) dtos: dicTypeUpdOneDto[]): Promise<R> {
    return this.dicTypeService.updDicTypes(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除字典类型',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:dicType:del',
    label: '删除字典类型',
  })
  async delDicType(@Body() ids: any[]): Promise<R> {
    return this.dicTypeService.delDicType(ids);
  }
}
