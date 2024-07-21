import { Body, Controller, Delete, Get, Query, UsePipes } from '@nestjs/common';
import { OnlineUserService } from './online-user.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { onlineUserSelListDto } from './dto';

@Controller('/sys-monitor/online-user')
@ApiTags('在线用户')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class OnlineUserController {
  constructor(private readonly onlineUserService: OnlineUserService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询在线用户',
  })
  @Authorize({
    permission: 'sysMonitor:onlineUser:selList',
    label: '分页查询在线用户',
  })
  async selOnlineUser(@Query() dto: onlineUserSelListDto): Promise<R> {
    return this.onlineUserService.selOnlineUser(dto);
  }

  @Delete()
  @ApiOperation({
    summary: '强退用户',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysMonitor:onlineUser:del',
    label: '强退用户',
  })
  async delOnlineUser(@Body() ids: any[]): Promise<R> {
    return this.onlineUserService.delOnlineUser(ids);
  }
}
