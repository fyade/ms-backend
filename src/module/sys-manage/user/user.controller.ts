import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { adminNewUserDto, loginDto, registDto, resetPsdDto, userDto, userListSelDto } from './dto';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sys-manage/user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/page')
  @Authorize('sysManage:user:selList')
  async userSelList(@Query() dto: userListSelDto): Promise<R> {
    return this.userService.userSelList(dto);
  }

  @Post()
  @Authorize('sysManage:user:adminNewUser')
  async insUser(@Body() dto: adminNewUserDto) {
    return this.userService.insUser(dto);
  }

  @Post('/resetpsd')
  @Authorize('sysManage:user:adminResetPsd')
  async resetPsd(@Body() dto: resetPsdDto): Promise<R> {
    return this.userService.resetPsd(dto);
  }
}
