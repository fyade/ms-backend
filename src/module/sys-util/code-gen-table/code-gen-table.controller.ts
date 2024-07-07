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
  @Authorize('sysUtil:codeGenTable:selList')
  async selCodeGenTable(@Query() dto: selListDto): Promise<R> {
    return this.codeGenTableService.selCodeGenTable(dto);
  }

  @Get('/all')
  @Authorize('sysUtil:codeGenTable:selAll')
  async selAll(@Query() dto: selAllDto) {
    return this.codeGenTableService.selAll(dto);
  }

  @Get('/ids')
  @Authorize('sysUtil:codeGenTable:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.codeGenTableService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('sysUtil:codeGenTable:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.codeGenTableService.selOne(id);
  }

  @Post()
  @Authorize('sysUtil:codeGenTable:ins')
  async insCodeGenTable(@Body() dto: insOneDto): Promise<R> {
    return this.codeGenTableService.insCodeGenTable(dto);
  }

  @Post('/s')
  @Authorize('sysUtil:codeGenTable:inss')
  async insCodeGenTables(@Body(
    new ParseArrayPipe({
      items: insOneDto
    })
  ) dto: insOneDto[]): Promise<R> {
    return this.codeGenTableService.insCodeGenTables(dto);
  }

  @Put()
  @Authorize('sysUtil:codeGenTable:upd')
  async updCodeGenTable(@Body() dto: updOneDto): Promise<R> {
    return this.codeGenTableService.updCodeGenTable(dto);
  }

  @Put('/s')
  @Authorize('sysUtil:codeGenTable:upds')
  async updCodeGenTables(@Body(
    new ParseArrayPipe({
      items: updOneDto
    })
  ) dto: updOneDto[]): Promise<R> {
    return this.codeGenTableService.updCodeGenTables(dto);
  }

  @Delete()
  @Authorize('sysUtil:codeGenTable:del')
  async delCodeGenTable(@Body() ids: any[]): Promise<R> {
    return this.codeGenTableService.delCodeGenTable(ids);
  }
}
