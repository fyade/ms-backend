import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { UserLoginService } from './user-login.service';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';

@Controller('/sys-monitor/user-login')
@ApiTags('登录日志表')
export class UserLoginController {
  constructor(private readonly userLoginService: UserLoginService) {
  }

  @Get()
  @Authorize('sysMonitor:userLogin:selList')
  async selUserLogin(@Query() dto: selListDto): Promise<R> {
    return this.userLoginService.selUserLogin(dto);
  }

  @Get('/all')
  @Authorize('sysMonitor:userLogin:selAll')
  async selAll(@Query() dto: selAllDto) {
    return this.userLoginService.selAll(dto);
  }

  @Get('/ids')
  @Authorize('sysMonitor:userLogin:selOnes')
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.userLoginService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize('sysMonitor:userLogin:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.userLoginService.selOne(id);
  }

  @Post()
  @Authorize('sysMonitor:userLogin:ins')
  async insUserLogin(@Body() dto: insOneDto): Promise<R> {
    return this.userLoginService.insUserLogin(dto);
  }

  @Post('/s')
  @Authorize('sysMonitor:userLogin:inss')
  async insUserLogins(@Body() dto: insOneDto[]): Promise<R> {
    return this.userLoginService.insUserLogins(dto);
  }

  @Put()
  @Authorize('sysMonitor:userLogin:upd')
  async updUserLogin(@Body() dto: updOneDto): Promise<R> {
    return this.userLoginService.updUserLogin(dto);
  }

  @Put('/s')
  @Authorize('sysMonitor:userLogin:upds')
  async updUserLogins(@Body() dto: updOneDto[]): Promise<R> {
    return this.userLoginService.updUserLogins(dto);
  }

  @Delete()
  @Authorize('sysMonitor:userLogin:del')
  async delUserLogin(@Body() ids: any[]): Promise<R> {
    return this.userLoginService.delUserLogin(ids);
  }
}
