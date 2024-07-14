import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LogUserLoginService } from './log-user-login.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { logUserLoginSelListDto, logUserLoginSelAllDto, logUserLoginInsOneDto, logUserLoginUpdOneDto } from './dto';

@Controller('/sys-monitor/log-user-login')
@ApiTags('登录日志')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class LogUserLoginController {
  constructor(private readonly logUserLoginService: LogUserLoginService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询登录日志',
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:selList',
    label: '分页查询登录日志',
  })
  async selLogUserLogin(@Query() dto: logUserLoginSelListDto): Promise<R> {
    return this.logUserLoginService.selLogUserLogin(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有登录日志',
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:selAll',
    label: '查询所有登录日志',
  })
  async selAll(@Query() dto: logUserLoginSelAllDto): Promise<R> {
    return this.logUserLoginService.selAll(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个登录日志（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:selOnes',
    label: '查询多个登录日志（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.logUserLoginService.selOnes(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个登录日志',
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:selOne',
    label: '查询单个登录日志',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.logUserLoginService.selOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增登录日志',
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:ins',
    label: '新增登录日志',
  })
  async insLogUserLogin(@Body() dto: logUserLoginInsOneDto): Promise<R> {
    return this.logUserLoginService.insLogUserLogin(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增登录日志',
  })
  @ApiBody({
    isArray: true,
    type: logUserLoginInsOneDto,
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:inss',
    label: '批量新增登录日志',
  })
  async insLogUserLogins(@Body(
    new ParseArrayPipe({
      items: logUserLoginInsOneDto,
    }),
  ) dto: logUserLoginInsOneDto[]): Promise<R> {
    return this.logUserLoginService.insLogUserLogins(dto);
  }

  @Put()
  @ApiOperation({
    summary: '修改登录日志',
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:upd',
    label: '修改登录日志',
  })
  async updLogUserLogin(@Body() dto: logUserLoginUpdOneDto): Promise<R> {
    return this.logUserLoginService.updLogUserLogin(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改登录日志',
  })
  @ApiBody({
    isArray: true,
    type: logUserLoginUpdOneDto,
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:upds',
    label: '批量修改登录日志',
  })
  async updLogUserLogins(@Body(
    new ParseArrayPipe({
      items: logUserLoginUpdOneDto,
    }),
  ) dto: logUserLoginUpdOneDto[]): Promise<R> {
    return this.logUserLoginService.updLogUserLogins(dto);
  }

  @Delete()
  @ApiOperation({
    summary: '删除登录日志',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysMonitor:logUserLogin:del',
    label: '删除登录日志',
  })
  async delLogUserLogin(@Body() ids: any[]): Promise<R> {
    return this.logUserLoginService.delLogUserLogin(ids);
  }
}
