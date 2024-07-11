import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DicTypeService } from './dic-type.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/dic-type')
@ApiTags('字典类型')
@UsePipes(new ValidationPipe())
export class DicTypeController {
  constructor(private readonly dicTypeService: DicTypeService) {
  }

  @Get()
  @Authorize({
    permission: 'sysManage:dicType:selList',
    label: '分页查询字典类型',
  })
  async selDicType(@Query() dto: selListDto): Promise<R> {
    return this.dicTypeService.selDicType(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:dicType:selAll',
    label: '查询所有字典类型',
  })
  async selAll(@Query() dto: selAllDto) {
    return this.dicTypeService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysManage:dicType:selOnes',
    label: '查询多个字典类型（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.dicTypeService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:dicType:selOne',
    label: '查询单个字典类型',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.dicTypeService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysManage:dicType:ins',
    label: '新增字典类型',
  })
  async insDicType(@Body() dto: insOneDto): Promise<R> {
    return this.dicTypeService.insDicType(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysManage:dicType:inss',
    label: '批量新增字典类型',
  })
  async insDicTypes(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.dicTypeService.insDicTypes(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysManage:dicType:upd',
    label: '修改字典类型',
  })
  async updDicType(@Body() dto: updOneDto): Promise<R> {
    return this.dicTypeService.updDicType(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysManage:dicType:upds',
    label: '批量修改字典类型',
  })
  async updDicTypes(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.dicTypeService.updDicTypes(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:dicType:del',
    label: '删除字典类型',
  })
  async delDicType(@Body() ids: any[]): Promise<R> {
    return this.dicTypeService.delDicType(ids);
  }
}
