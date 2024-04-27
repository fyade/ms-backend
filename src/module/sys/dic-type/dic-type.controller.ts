import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DicTypeService } from './dic-type.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Controller('/sys/dic-type')
@ApiTags('字典类型')
export class DicTypeController {
  constructor(private readonly dicTypeService: DicTypeService) {
  }

  @Get()
  @Authorize('system:dicType:selList')
  async selDicType(@Query() dto: selListDto): Promise<R> {
    return this.dicTypeService.selDicType(dto);
  }

  @Get('/all')
  @Authorize('system:dicType:selAll')
  async selAll(@Query() dto: selAllDto) {
    return this.dicTypeService.selAll(dto);
  }

  @Get('/:id')
  @Authorize('system:dicType:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.dicTypeService.selOne(id);
  }

  @Post()
  @Authorize('system:dicType:ins')
  async insDicType(@Body() dto: insOneDto): Promise<R> {
    return this.dicTypeService.insDicType(dto);
  }

  @Put()
  @Authorize('system:dicType:upd')
  async updDicType(@Body() dto: updOneDto): Promise<R> {
    return this.dicTypeService.updDicType(dto);
  }

  @Delete()
  @Authorize('system:dicType:del')
  async delDicType(@Body() ids: any[]): Promise<R> {
    return this.dicTypeService.delDicType(ids);
  }
}
