import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { CodeGenTableService } from './code-gen-table.service';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-util/code-gen-table')
@ApiTags('代码生成-表信息表')
@UsePipes(new ValidationPipe())
export class CodeGenTableController {
  constructor(private readonly codeGenTableService: CodeGenTableService) {
  }

  @Get()
  @Authorize({
    permission: 'sysUtil:codeGenTable:selList',
    label: '分页查询表信息',
  })
  async selCodeGenTable(@Query() dto: selListDto): Promise<R> {
    return this.codeGenTableService.selCodeGenTable(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysUtil:codeGenTable:selAll',
    label: '查询所有表信息',
  })
  async selAll(@Query() dto: selAllDto) {
    return this.codeGenTableService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysUtil:codeGenTable:selOnes',
    label: '查询多个表信息（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.codeGenTableService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysUtil:codeGenTable:selOne',
    label: '查询单个表信息',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.codeGenTableService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysUtil:codeGenTable:ins',
    label: '新增表信息',
  })
  async insCodeGenTable(@Body() dto: insOneDto): Promise<R> {
    return this.codeGenTableService.insCodeGenTable(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysUtil:codeGenTable:inss',
    label: '批量新增表信息',
  })
  async insCodeGenTables(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.codeGenTableService.insCodeGenTables(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysUtil:codeGenTable:upd',
    label: '修改表信息',
  })
  async updCodeGenTable(@Body() dto: updOneDto): Promise<R> {
    return this.codeGenTableService.updCodeGenTable(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysUtil:codeGenTable:upds',
    label: '批量修改表信息',
  })
  async updCodeGenTables(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.codeGenTableService.updCodeGenTables(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysUtil:codeGenTable:del',
    label: '删除表信息',
  })
  async delCodeGenTable(@Body() ids: any[]): Promise<R> {
    return this.codeGenTableService.delCodeGenTable(ids);
  }
}
