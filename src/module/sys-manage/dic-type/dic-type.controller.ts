import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DicTypeService } from './dic-type.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Controller('/sys-manage/dic-type')
@ApiTags('字典类型')
export class DicTypeController {
  constructor(private readonly dicTypeService: DicTypeService) {
  }

  @Get()
  @Authorize('sysManage:dicType:selList')
  async selDicType(@Query() dto: selListDto): Promise<R> {
    return this.dicTypeService.selDicType(dto);
  }

  @Get('/all')
  @Authorize('sysManage:dicType:selAll')
  async selAll(@Query() dto: selAllDto) {
    return this.dicTypeService.selAll(dto);
  }

  @Get('/ids')
  @Authorize('sysManage:dicType:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.dicTypeService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('sysManage:dicType:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.dicTypeService.selOne(id);
  }

  @Post()
  @Authorize('sysManage:dicType:ins')
  async insDicType(@Body() dto: insOneDto): Promise<R> {
    return this.dicTypeService.insDicType(dto);
  }

  @Post('/s')
  @Authorize('sysManage:dicType:inss')
  async insDicTypes(@Body() dto: insOneDto[]): Promise<R> {
    return this.dicTypeService.insDicTypes(dto);
  }

  @Put()
  @Authorize('sysManage:dicType:upd')
  async updDicType(@Body() dto: updOneDto): Promise<R> {
    return this.dicTypeService.updDicType(dto);
  }

  @Put('/s')
  @Authorize('sysManage:dicType:upds')
  async updDicTypes(@Body() dto: updOneDto[]): Promise<R> {
    return this.dicTypeService.updDicTypes(dto);
  }

  @Delete()
  @Authorize('sysManage:dicType:del')
  async delDicType(@Body() ids: any[]): Promise<R> {
    return this.dicTypeService.delDicType(ids);
  }
}
