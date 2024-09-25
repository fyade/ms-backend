import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserUserGroupService } from './user-user-group.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import {
  userUserGroupSelListDto,
  userUserGroupSelAllDto,
  userUserGroupInsOneDto,
  userUserGroupUpdOneDto,
  userUserGroupUpdUUGDtp,
  userUserGroupUpdUGUDtp,
} from './dto';

@Controller('/sys-manage/user-user-group')
@ApiTags('系统管理/用户用户组')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class UserUserGroupController {
  constructor(private readonly userUserGroupService: UserUserGroupService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户用户组',
  })
  @Authorize({
    permission: 'sysManage:userUserGroup:selList',
    label: '分页查询用户用户组',
  })
  async selUserUserGroup(@Query() dto: userUserGroupSelListDto): Promise<R> {
    return this.userUserGroupService.selUserUserGroup(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有用户用户组',
  })
  @Authorize({
    permission: 'sysManage:userUserGroup:selAll',
    label: '查询所有用户用户组',
  })
  async selAllUserUserGroup(@Query() dto: userUserGroupSelAllDto): Promise<R> {
    return this.userUserGroupService.selAllUserUserGroup(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个用户用户组（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:userUserGroup:selOnes',
    label: '查询多个用户用户组（根据id）',
  })
  async selOnesUserUserGroup(@Query() ids: number[]): Promise<R> {
    return this.userUserGroupService.selOnesUserUserGroup(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个用户用户组',
  })
  @Authorize({
    permission: 'sysManage:userUserGroup:selOne',
    label: '查询单个用户用户组',
  })
  async selOneUserUserGroup(@Param('id') id: number): Promise<R> {
    return this.userUserGroupService.selOneUserUserGroup(id);
  }

  @Post('/uug')
  @ApiOperation({
    summary: '更新用户用户组（uug）',
  })
  @Authorize({
    permission: 'sysManage:userUserGroup:updUug',
    label: '更新用户用户组（uug）',
  })
  async updUserUserGroupUUG(@Body() dto: userUserGroupUpdUUGDtp): Promise<R> {
    return this.userUserGroupService.updUserUserGroupUUG(dto);
  }

  @Post('/ugu')
  @ApiOperation({
    summary: '更新用户用户组（ugu）',
  })
  @Authorize({
    permission: 'sysManage:userUserGroup:updUgu',
    label: '更新用户用户组（ugu）',
  })
  async updUserUserGroupUGU(@Body() dto: userUserGroupUpdUGUDtp): Promise<R> {
    return this.userUserGroupService.updUserUserGroupUGU(dto);
  }

  @Delete()
  @ApiOperation({
    summary: '删除用户用户组',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:userUserGroup:del',
    label: '删除用户用户组',
  })
  async delUserUserGroup(@Body() ids: number[]): Promise<R> {
    return this.userUserGroupService.delUserUserGroup(ids);
  }
}
