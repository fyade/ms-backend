import { Controller, Get, UsePipes } from '@nestjs/common';
import { OnlineUserService } from './online-user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';

@Controller('/sys-monitor/online-user')
@ApiTags('在线用户')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class OnlineUserController {
  constructor(private readonly onlineUserService: OnlineUserService) {
  }

  @Get()
  @ApiOperation({
    summary: '',
  })
  @Authorize({
    permission: '',
    label: '',
  })
  async selOnlineUser(): Promise<R> {
    return this.onlineUserService.selOnlineUser();
  }
}
