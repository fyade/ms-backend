import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LogAlgorithmCallService } from './log-algorithm-call.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import {
  logAlgorithmCallSelListDto,
  logAlgorithmCallSelAllDto,
  logAlgorithmCallInsOneDto,
  logAlgorithmCallUpdOneDto,
} from './dto';

@Controller('/sys-monitor/log-algorithm-call')
@ApiTags('算法调用日志')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class LogAlgorithmCallController {
  constructor(private readonly logAlgorithmCallService: LogAlgorithmCallService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询算法调用日志',
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:selList',
    label: '分页查询算法调用日志',
  })
  async selLogAlgorithmCall(@Query() dto: logAlgorithmCallSelListDto): Promise<R> {
    return this.logAlgorithmCallService.selLogAlgorithmCall(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有算法调用日志',
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:selAll',
    label: '查询所有算法调用日志',
  })
  async selAll(@Query() dto: logAlgorithmCallSelAllDto): Promise<R> {
    return this.logAlgorithmCallService.selAll(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个算法调用日志（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:selOnes',
    label: '查询多个算法调用日志（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.logAlgorithmCallService.selOnes(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个算法调用日志',
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:selOne',
    label: '查询单个算法调用日志',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.logAlgorithmCallService.selOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增算法调用日志',
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:ins',
    label: '新增算法调用日志',
  })
  async insLogAlgorithmCall(@Body() dto: logAlgorithmCallInsOneDto): Promise<R> {
    return this.logAlgorithmCallService.insLogAlgorithmCall(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增算法调用日志',
  })
  @ApiBody({
    isArray: true,
    type: logAlgorithmCallInsOneDto,
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:inss',
    label: '批量新增算法调用日志',
  })
  async insLogAlgorithmCalls(@Body(
    new ParseArrayPipe({
      items: logAlgorithmCallInsOneDto,
    }),
  ) dtos: logAlgorithmCallInsOneDto[]): Promise<R> {
    return this.logAlgorithmCallService.insLogAlgorithmCalls(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改算法调用日志',
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:upd',
    label: '修改算法调用日志',
  })
  async updLogAlgorithmCall(@Body() dto: logAlgorithmCallUpdOneDto): Promise<R> {
    return this.logAlgorithmCallService.updLogAlgorithmCall(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改算法调用日志',
  })
  @ApiBody({
    isArray: true,
    type: logAlgorithmCallUpdOneDto,
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:upds',
    label: '批量修改算法调用日志',
  })
  async updLogAlgorithmCalls(@Body(
    new ParseArrayPipe({
      items: logAlgorithmCallUpdOneDto,
    }),
  ) dtos: logAlgorithmCallUpdOneDto[]): Promise<R> {
    return this.logAlgorithmCallService.updLogAlgorithmCalls(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除算法调用日志',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysMonitor:logAlgorithmCall:del',
    label: '删除算法调用日志',
  })
  async delLogAlgorithmCall(@Body() ids: any[]): Promise<R> {
    return this.logAlgorithmCallService.delLogAlgorithmCall(ids);
  }
}
