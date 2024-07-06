import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto, registDto } from './dto';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { decrypt } from '../../../util/EncryptUtils';
import * as uaparser from 'ua-parser-js';

@Controller('/sys/user')
@ApiTags('用户')
@UsePipes(new ValidationPipe())
export class UserLoginController {
  constructor(private readonly userService: UserService) {
  }

  @Post('/regist')
  async regist(@Body() dto: registDto): Promise<R> {
    dto.password = decrypt(dto.password);
    return this.userService.regist(dto);
  }

  @Post('/login')
  async login(@Body() dto: loginDto, @Req() request): Promise<R> {
    dto.password = decrypt(dto.password);
    const { loginIp, loginBrowser, loginOs } = this.getLoginInfo(request);
    return this.userService.login(dto, { loginIp, loginBrowser, loginOs });
  }

  @Post('/adminlogin')
  @Authorize('system:user:adminlogin')
  async adminLogin(@Body() dto: loginDto, @Req() request): Promise<R> {
    dto.password = decrypt(dto.password);
    const { loginIp, loginBrowser, loginOs } = this.getLoginInfo(request);
    return this.userService.adminlogin(dto, { loginIp, loginBrowser, loginOs });
  }

  getLoginInfo(request) {
    const loginIp = request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || request.ip;
    const userAgentString = request.headers['user-agent'];
    const userAgent = uaparser(userAgentString);
    const browser = userAgent.browser;
    const os = userAgent.os;
    const loginBrowser = `${browser.name} ${browser.version}`;
    const loginOs = `${os.name} ${os.version}`;
    return { loginIp, loginBrowser, loginOs };
  }
}
