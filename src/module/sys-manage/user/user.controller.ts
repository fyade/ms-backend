import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { adminNewUserDto, resetPsdDto, updPsdDto, userDto, userListSelDto } from './dto';
import { R } from '../../../common/R';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { decrypt } from '../../../util/EncryptUtils';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/user')
@ApiTags('系统管理/用户')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/self-info')
  @ApiOperation({
    summary: '查询个人信息',
  })
  @Authorize({
    permission: 'sysManage:user:getSelfInfo',
    label: '查询个人信息',
  })
  async getSelfInfo() {
    return this.userService.getSelfInfo();
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个用户（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: String,
  })
  @Authorize({
    permission: 'sysManage:user:selOnes',
    label: '查询多个用户（根据id）',
  })
  async selOnesUser(@Query() ids: string[]): Promise<R> {
    return this.userService.selOnesUser(ids);
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户',
  })
  @Authorize({
    permission: 'sysManage:user:selList',
    label: '分页查询用户',
  })
  async userSelList(@Query() dto: userListSelDto): Promise<R> {
    return this.userService.userSelList(dto);
  }

  @Post()
  @ApiOperation({
    summary: '管理员新建用户',
  })
  @Authorize({
    permission: 'sysManage:user:adminNewUser',
    label: '管理员新建用户',
  })
  async insUser(@Body() dto: adminNewUserDto) {
    if (dto.psdType === 'b') {
      dto.password = decrypt(dto.password);
    }
    delete dto.psdType;
    return this.userService.insUser(dto);
  }

  @Post('/upd-user')
  @ApiOperation({
    summary: '修改个人信息',
  })
  @Authorize({
    permission: 'sysManage:user:updUser',
    label: '修改个人信息',
  })
  async updUser(@Body() dto: userDto) {
    delete dto.password;
    return this.userService.updUser(dto);
  }

  @Post('/upd-psd')
  @ApiOperation({
    summary: '修改密码',
  })
  @Authorize({
    permission: 'sysManage:user:updPsd',
    label: '修改密码',
  })
  async updPsd(@Body() dto: updPsdDto) {
    if (dto.oldpType === 'b') {
      dto.oldp = decrypt(dto.oldp);
    }
    if (dto.newp1Type === 'b') {
      dto.newp1 = decrypt(dto.newp1);
    }
    if (dto.newp2Type === 'b') {
      dto.newp2 = decrypt(dto.newp2);
    }
    delete dto.oldpType;
    delete dto.newp1Type;
    delete dto.newp2Type;
    if (dto.newp1 !== dto.newp2) return R.err('新密码不一致。');
    return this.userService.updPsd(dto);
  }

  @Post('/admin-reset-user-psd')
  @ApiOperation({
    summary: '管理员重置用户密码',
  })
  @Authorize({
    permission: 'sysManage:user:adminResetUserPsd',
    label: '管理员重置用户密码',
  })
  async adminResetUserPsd(@Body() dto: resetPsdDto): Promise<R> {
    if (dto.psdType === 'b') {
      dto.password = decrypt(dto.password);
    }
    delete dto.psdType;
    return this.userService.adminResetUserPsd(dto);
  }
}
