import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto, registDto } from './dto';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { decrypt } from '../../../util/EncryptUtils';
import { getIpInfoFromRequest } from '../../../util/RequestUtils';
import { Request } from 'express';

@Controller('/sys/user')
@ApiTags('用户')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class UserLoginController {
  constructor(private readonly userService: UserService) {
  }

  @Post('/regist')
  @ApiOperation({
    summary: '用户注册',
  })
  async regist(@Body() dto: registDto): Promise<R> {
    if (dto.psdType === 'b') {
      dto.password = decrypt(dto.password);
    }
    delete dto.psdType;
    return this.userService.regist(dto);
  }

  @Post('/login')
  @ApiOperation({
    summary: '用户登录',
  })
  async login(@Body() dto: loginDto, @Req() request: Request): Promise<R> {
    if (dto.psdType === 'b') {
      dto.password = decrypt(dto.password);
    }
    delete dto.psdType;
    const { ip: loginIp, browser: loginBrowser, os: loginOs } = getIpInfoFromRequest(request);
    return this.userService.login(dto, { loginIp, loginBrowser, loginOs });
  }

  @Post('/adminlogin')
  @ApiOperation({
    summary: '管理员登录',
  })
  @Authorize({
    permission: 'system:user:adminlogin',
    label: '管理员登录',
  })
  async adminLogin(@Body() dto: loginDto, @Req() request: Request): Promise<R> {
    if (dto.psdType === 'b') {
      dto.password = decrypt(dto.password);
    }
    delete dto.psdType;
    const { ip: loginIp, browser: loginBrowser, os: loginOs } = getIpInfoFromRequest(request);
    return this.userService.adminlogin(dto, { loginIp, loginBrowser, loginOs });
  }
}
