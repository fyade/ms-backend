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
  @Authorize('sysUtil:codeGenColumn:selList')
  async selCodeGenColumn(@Query() dto: selListDto): Promise<R> {
    return this.codeGenColumnService.selCodeGenColumn(dto);
  }

  @Get('/all')
  @Authorize('sysUtil:codeGenColumn:selAll')
  async selAll(@Query() dto: selAllDto) {
    return this.codeGenColumnService.selAll(dto);
  }

  @Get('/ids')
  @Authorize('sysUtil:codeGenColumn:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.codeGenColumnService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('sysUtil:codeGenColumn:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.codeGenColumnService.selOne(id);
  }

  @Post()
  @Authorize('sysUtil:codeGenColumn:ins')
  async insCodeGenColumn(@Body() dto: insOneDto): Promise<R> {
    return this.codeGenColumnService.insCodeGenColumn(dto);
  }

  @Post('/s')
  @Authorize('sysUtil:codeGenColumn:inss')
  async insCodeGenColumns(@Body(
    new ParseArrayPipe({
      items: insOneDto
    })
  ) dto: insOneDto[]): Promise<R> {
    return this.codeGenColumnService.insCodeGenColumns(dto);
  }

  @Put()
  @Authorize('sysUtil:codeGenColumn:upd')
  async updCodeGenColumn(@Body() dto: updOneDto): Promise<R> {
    return this.codeGenColumnService.updCodeGenColumn(dto);
  }

  @Put('/s')
  @Authorize('sysUtil:codeGenColumn:upds')
  async updCodeGenColumns(@Body(
    new ParseArrayPipe({
      items: updOneDto
    })
  ) dto: updOneDto[]): Promise<R> {
    return this.codeGenColumnService.updCodeGenColumns(dto);
  }

  @Delete()
  @Authorize('sysUtil:codeGenColumn:del')
  async delCodeGenColumn(@Body() ids: any[]): Promise<R> {
    return this.codeGenColumnService.delCodeGenColumn(ids);
  }
}
