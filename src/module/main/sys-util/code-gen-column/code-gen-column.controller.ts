import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CodeGenColumnService } from './code-gen-column.service';
import { Authorize } from '../../../../decorator/authorizeDecorator';
import { R } from '../../../../common/R';
import { ValidationPipe } from '../../../../pipe/validation/validation.pipe';
import { codeGenColumnSelListDto, codeGenColumnSelAllDto, codeGenColumnInsOneDto, codeGenColumnUpdOneDto } from './dto';

@Controller('/main/sys-util/code-gen-column')
@ApiTags('系统工具/代码生成-列信息')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class CodeGenColumnController {
  constructor(private readonly codeGenColumnService: CodeGenColumnService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询代码生成-列信息',
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selList',
    label: '分页查询代码生成-列信息',
  })
  async selCodeGenColumn(@Query() dto: codeGenColumnSelListDto): Promise<R> {
    return this.codeGenColumnService.selCodeGenColumn(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有代码生成-列信息',
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selAll',
    label: '查询所有代码生成-列信息',
  })
  async selAllCodeGenColumn(@Query() dto: codeGenColumnSelAllDto): Promise<R> {
    return this.codeGenColumnService.selAllCodeGenColumn(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个代码生成-列信息（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selOnes',
    label: '查询多个代码生成-列信息（根据id）',
  })
  async selOnesCodeGenColumn(@Query() ids: number[]): Promise<R> {
    return this.codeGenColumnService.selOnesCodeGenColumn(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个代码生成-列信息',
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:selOne',
    label: '查询单个代码生成-列信息',
  })
  async selOneCodeGenColumn(@Param('id') id: number): Promise<R> {
    return this.codeGenColumnService.selOneCodeGenColumn(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增代码生成-列信息',
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:ins',
    label: '新增代码生成-列信息',
  })
  async insCodeGenColumn(@Body() dto: codeGenColumnInsOneDto): Promise<R> {
    return this.codeGenColumnService.insCodeGenColumn(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增代码生成-列信息',
  })
  @ApiBody({
    isArray: true,
    type: codeGenColumnInsOneDto,
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:inss',
    label: '批量新增代码生成-列信息',
  })
  async insCodeGenColumns(@Body(
    new ParseArrayPipe({
      items: codeGenColumnInsOneDto,
    }),
  ) dtos: codeGenColumnInsOneDto[]): Promise<R> {
    return this.codeGenColumnService.insCodeGenColumns(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改代码生成-列信息',
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:upd',
    label: '修改代码生成-列信息',
  })
  async updCodeGenColumn(@Body() dto: codeGenColumnUpdOneDto): Promise<R> {
    return this.codeGenColumnService.updCodeGenColumn(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改代码生成-列信息',
  })
  @ApiBody({
    isArray: true,
    type: codeGenColumnUpdOneDto,
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:upds',
    label: '批量修改代码生成-列信息',
  })
  async updCodeGenColumns(@Body(
    new ParseArrayPipe({
      items: codeGenColumnUpdOneDto,
    }),
  ) dtos: codeGenColumnUpdOneDto[]): Promise<R> {
    return this.codeGenColumnService.updCodeGenColumns(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除代码生成-列信息',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysUtil:codeGenColumn:del',
    label: '删除代码生成-列信息',
  })
  async delCodeGenColumn(@Body() ids: number[]): Promise<R> {
    return this.codeGenColumnService.delCodeGenColumn(ids);
  }
}
