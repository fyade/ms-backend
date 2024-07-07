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
  @Authorize('sysMonitor:userLogin:selList')
  async selLogUserLogin(@Query() dto: selListDto): Promise<R> {
    return this.logUserLoginService.selLogUserLogin(dto);
  }

  @Get('/all')
  @Authorize('sysMonitor:userLogin:selAll')
  async selAll(@Query() dto: selAllDto) {
    return this.logUserLoginService.selAll(dto);
  }

  @Get('/ids')
  @Authorize('sysMonitor:userLogin:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.logUserLoginService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('sysMonitor:userLogin:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.logUserLoginService.selOne(id);
  }

  @Post()
  @Authorize('sysMonitor:userLogin:ins')
  async insLogUserLogin(@Body() dto: insOneDto): Promise<R> {
    return this.logUserLoginService.insLogUserLogin(dto);
  }

  @Post('/s')
  @Authorize('sysMonitor:userLogin:inss')
  async insLogUserLogins(@Body(
    new ParseArrayPipe({
      items: insOneDto
    })
  ) dto: insOneDto[]): Promise<R> {
    return this.logUserLoginService.insLogUserLogins(dto);
  }

  @Put()
  @Authorize('sysMonitor:userLogin:upd')
  async updLogUserLogin(@Body() dto: updOneDto): Promise<R> {
    return this.logUserLoginService.updLogUserLogin(dto);
  }

  @Put('/s')
  @Authorize('sysMonitor:userLogin:upds')
  async updLogUserLogins(@Body(
    new ParseArrayPipe({
      items: updOneDto
    })
  ) dto: updOneDto[]): Promise<R> {
    return this.logUserLoginService.updLogUserLogins(dto);
  }

  @Delete()
  @Authorize('sysMonitor:userLogin:del')
  async delLogUserLogin(@Body() ids: any[]): Promise<R> {
    return this.logUserLoginService.delLogUserLogin(ids);
  }
}
