import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto, registDto, resetPsdDto, userDto, userListSelDto } from './dto';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';

@Controller('/sys/user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('/regist')
  async regist(@Body() dto: registDto): Promise<R> {
    return this.userService.regist(dto);
  }

  @Post('/login')
  async login(@Body() dto: loginDto): Promise<R> {
    return this.userService.login(dto);
  }

  @Post('/adminlogin')
  @Authorize('system:user:adminlogin')
  async adminLogin(@Body() dto: loginDto): Promise<R> {
    return this.userService.adminlogin(dto);
  }

  @Get('/page')
  @Authorize('system:user:selList')
  async userSelList(@Query() dto: userListSelDto): Promise<R> {
    return this.userService.userSelList(dto);
  }

  @Post('/resetpsd')
  @Authorize('system:user:resetPsd')
  async resetPsd(@Body() dto: resetPsdDto): Promise<R> {
    return this.userService.resetPsd(dto);
  }
}
