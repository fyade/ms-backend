import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { adminNewUserDto, loginDto, registDto, resetPsdDto, updPsdDto, userDto, userListSelDto } from './dto';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiTags } from '@nestjs/swagger';
import { decrypt } from '../../../util/EncryptUtils';

@Controller('/sys-manage/user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/self-info')
  @Authorize('sysManage:user:getSelfInfo')
  async getSelfInfo() {
    return this.userService.getSelfInfo()
  }

  @Get('/page')
  @Authorize('sysManage:user:selList')
  async userSelList(@Query() dto: userListSelDto): Promise<R> {
    return this.userService.userSelList(dto);
  }

  @Post()
  @Authorize('sysManage:user:adminNewUser')
  async insUser(@Body() dto: adminNewUserDto) {
    dto.password = decrypt(dto.password);
    return this.userService.insUser(dto);
  }

  @Post('/upd-user')
  @Authorize('sysManage:user:updUser')
  async updUser(@Body() dto: userDto) {
    return this.userService.updUser(dto)
  }

  @Post('/upd-psd')
  @Authorize('sysManage:user:updPsd')
  async updPsd(@Body() dto: updPsdDto) {
    dto.oldp = decrypt(dto.oldp)
    dto.newp1 = decrypt(dto.newp1)
    dto.newp2 = decrypt(dto.newp2)
    if (dto.newp1 !== dto.newp2) return R.err('新密码不一致。')
    return this.userService.updPsd(dto)
  }

  @Post('/admin-reset-user-psd')
  @Authorize('sysManage:user:adminResetUserPsd')
  async adminResetUserPsd(@Body() dto: resetPsdDto): Promise<R> {
    dto.password = decrypt(dto.password);
    return this.userService.adminResetUserPsd(dto);
  }
}
