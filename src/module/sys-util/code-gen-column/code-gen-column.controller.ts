import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CodeGenColumnService } from './code-gen-column.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-util/code-gen-column')
@ApiTags('代码生成-列信息表')
@UsePipes(new ValidationPipe())
export class CodeGenColumnController {
  constructor(private readonly codeGenColumnService: CodeGenColumnService) {
  }

  @Get()
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selList',
    label: '分页查询列信息',
  })
  async selCodeGenColumn(@Query() dto: selListDto): Promise<R> {
    return this.codeGenColumnService.selCodeGenColumn(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selAll',
    label: '查询所有列信息',
  })
  async selAll(@Query() dto: selAllDto) {
    return this.codeGenColumnService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selOnes',
    label: '查询多个列信息（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.codeGenColumnService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selOne',
    label: '查询单个列信息',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.codeGenColumnService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysUtil:codeGenColumn:ins',
    label: '新增列信息',
  })
  async insCodeGenColumn(@Body() dto: insOneDto): Promise<R> {
    return this.codeGenColumnService.insCodeGenColumn(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysUtil:codeGenColumn:inss',
    label: '批量新增列信息',
  })
  async insCodeGenColumns(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.codeGenColumnService.insCodeGenColumns(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysUtil:codeGenColumn:upd',
    label: '修改列信息',
  })
  async updCodeGenColumn(@Body() dto: updOneDto): Promise<R> {
    return this.codeGenColumnService.updCodeGenColumn(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysUtil:codeGenColumn:upds',
    label: '批量修改列信息',
  })
  async updCodeGenColumns(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.codeGenColumnService.updCodeGenColumns(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysUtil:codeGenColumn:del',
    label: '删除列信息',
  })
  async delCodeGenColumn(@Body() ids: any[]): Promise<R> {
    return this.codeGenColumnService.delCodeGenColumn(ids);
  }
}
