import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DicDataService } from './dic-data.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Controller('/sys/dic-data')
@ApiTags('字典数据')
export class DicDataController {
  constructor(private readonly dicDataService: DicDataService) {
  }

  @Get()
  @Authorize('system:dicData:selList')
  async selDicData(@Query() dto: selListDto): Promise<R> {
    return this.dicDataService.selDicData(dto);
  }

  @Get('/:id')
  @Authorize('system:dicData:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.dicDataService.selOne(id);
  }

  @Post()
  @Authorize('system:dicData:ins')
  async insDicData(@Body() dto: insOneDto): Promise<R> {
    return this.dicDataService.insDicData(dto);
  }

  @Put()
  @Authorize('system:dicData:upd')
  async updDicData(@Body() dto: updOneDto): Promise<R> {
    return this.dicDataService.updDicData(dto);
  }

  @Delete()
  @Authorize('system:dicData:del')
  async delDicData(@Body() ids: any[]): Promise<R> {
    return this.dicDataService.delDicData(ids);
  }
}
