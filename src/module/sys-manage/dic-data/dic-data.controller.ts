import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
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
  @Authorize({
    permission: 'sysManage:dicData:selList',
    label: '分页查询字典数据',
  })
  async selDicData(@Query() dto: selListDto): Promise<R> {
    return this.dicDataService.selDicData(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:dicData:selAll',
    label: '查询所有字典数据',
  })
  async selAll(@Query() dto: selAllDto): Promise<R> {
    return this.dicDataService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysManage:dicData:selOnes',
    label: '查询多个字典数据（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.dicDataService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:dicData:selOne',
    label: '查询单个字典数据',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.dicDataService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysManage:dicData:ins',
    label: '新增字典数据',
  })
  async insDicData(@Body() dto: insOneDto): Promise<R> {
    return this.dicDataService.insDicData(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysManage:dicData:inss',
    label: '批量新增字典数据',
  })
  async insDicDatas(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.dicDataService.insDicDatas(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysManage:dicData:upd',
    label: '修改字典数据',
  })
  async updDicData(@Body() dto: updOneDto): Promise<R> {
    return this.dicDataService.updDicData(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysManage:dicData:upds',
    label: '批量修改字典数据',
  })
  async updDicDatas(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.dicDataService.updDicDatas(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:dicData:del',
    label: '删除字典数据',
  })
  async delDicData(@Body() ids: any[]): Promise<R> {
    return this.dicDataService.delDicData(ids);
  }
}
