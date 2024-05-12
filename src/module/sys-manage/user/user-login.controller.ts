import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { adminNewUserDto, loginDto, registDto, resetPsdDto, userDto, userListSelDto } from './dto';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys/user')
@ApiTags('用户')
export class UserLoginController {
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
  @UsePipes(new ValidationPipe())
  async adminLogin(@Body() dto: loginDto): Promise<R> {
    return this.userService.adminlogin(dto);
  }
}
