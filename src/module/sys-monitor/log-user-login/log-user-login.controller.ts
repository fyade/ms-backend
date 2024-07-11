import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { LogUserLoginService } from './log-user-login.service';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-monitor/user-login')
@ApiTags('登录日志表')
@UsePipes(new ValidationPipe())
export class LogUserLoginController {
  constructor(private readonly logUserLoginService: LogUserLoginService) {
  }

  @Get()
  @Authorize({
    permission: 'sysMonitor:userLogin:selList',
    label: '分页查询用户登录日志',
  })
  async selLogUserLogin(@Query() dto: selListDto): Promise<R> {
    return this.logUserLoginService.selLogUserLogin(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysMonitor:userLogin:selAll',
    label: '查询所有用户登录日志',
  })
  async selAll(@Query() dto: selAllDto) {
    return this.logUserLoginService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysMonitor:userLogin:selOnes',
    label: '查询多个用户登录日志（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.logUserLoginService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysMonitor:userLogin:selOne',
    label: '查询单个用户登录日志',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.logUserLoginService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysMonitor:userLogin:ins',
    label: '新增用户登录日志',
  })
  async insLogUserLogin(@Body() dto: insOneDto): Promise<R> {
    return this.logUserLoginService.insLogUserLogin(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysMonitor:userLogin:inss',
    label: '批量新增用户登录日志',
  })
  async insLogUserLogins(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.logUserLoginService.insLogUserLogins(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysMonitor:userLogin:upd',
    label: '修改用户登录日志',
  })
  async updLogUserLogin(@Body() dto: updOneDto): Promise<R> {
    return this.logUserLoginService.updLogUserLogin(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysMonitor:userLogin:upds',
    label: '批量修改用户登录日志',
  })
  async updLogUserLogins(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.logUserLoginService.updLogUserLogins(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysMonitor:userLogin:del',
    label: '删除用户登录日志',
  })
  async delLogUserLogin(@Body() ids: any[]): Promise<R> {
    return this.logUserLoginService.delLogUserLogin(ids);
  }
}
