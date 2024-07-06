import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DicDataService } from './dic-data.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/dic-data')
@ApiTags('字典数据')
@UsePipes(new ValidationPipe())
export class DicDataController {
  constructor(private readonly dicDataService: DicDataService) {
  }

  @Get()
  @Authorize('sysManage:dicData:selList')
  async selDicData(@Query() dto: selListDto): Promise<R> {
    return this.dicDataService.selDicData(dto);
  }

  @Get('/all')
  @Authorize('sysManage:dicData:selAll')
  async selAll(@Query() dto: selAllDto): Promise<R> {
    return this.dicDataService.selAll(dto);
  }

  @Get('/ids')
  @Authorize('sysManage:dicData:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.dicDataService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('sysManage:dicData:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.dicDataService.selOne(id);
  }

  @Post()
  @Authorize('sysManage:dicData:ins')
  async insDicData(@Body() dto: insOneDto): Promise<R> {
    return this.dicDataService.insDicData(dto);
  }

  @Post('/s')
  @Authorize('sysManage:dicData:inss')
  async insDicDatas(@Body() dto: insOneDto[]): Promise<R> {
    return this.dicDataService.insDicDatas(dto);
  }

  @Put()
  @Authorize('sysManage:dicData:upd')
  async updDicData(@Body() dto: updOneDto): Promise<R> {
    return this.dicDataService.updDicData(dto);
  }

  @Put('/s')
  @Authorize('sysManage:dicData:upds')
  async updDicDatas(@Body() dto: updOneDto[]): Promise<R> {
    return this.dicDataService.updDicDatas(dto);
  }

  @Delete()
  @Authorize('sysManage:dicData:del')
  async delDicData(@Body() ids: any[]): Promise<R> {
    return this.dicDataService.delDicData(ids);
  }
}
