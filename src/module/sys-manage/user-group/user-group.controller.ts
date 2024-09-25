import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserGroupService } from './user-group.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { userGroupSelListDto, userGroupSelAllDto, userGroupInsOneDto, userGroupUpdOneDto } from './dto';

@Controller('/sys-manage/user-group')
@ApiTags('系统管理/用户组')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户组',
  })
  @Authorize({
    permission: 'sysManage:userGroup:selList',
    label: '分页查询用户组',
  })
  async selUserGroup(@Query() dto: userGroupSelListDto): Promise<R> {
    return this.userGroupService.selUserGroup(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有用户组',
  })
  @Authorize({
    permission: 'sysManage:userGroup:selAll',
    label: '查询所有用户组',
  })
  async selAllUserGroup(@Query() dto: userGroupSelAllDto): Promise<R> {
    return this.userGroupService.selAllUserGroup(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个用户组（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:userGroup:selOnes',
    label: '查询多个用户组（根据id）',
  })
  async selOnesUserGroup(@Query() ids: number[]): Promise<R> {
    return this.userGroupService.selOnesUserGroup(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个用户组',
  })
  @Authorize({
    permission: 'sysManage:userGroup:selOne',
    label: '查询单个用户组',
  })
  async selOneUserGroup(@Param('id') id: number): Promise<R> {
    return this.userGroupService.selOneUserGroup(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增用户组',
  })
  @Authorize({
    permission: 'sysManage:userGroup:ins',
    label: '新增用户组',
  })
  async insUserGroup(@Body() dto: userGroupInsOneDto): Promise<R> {
    return this.userGroupService.insUserGroup(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增用户组',
  })
  @ApiBody({
    isArray: true,
    type: userGroupInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:userGroup:inss',
    label: '批量新增用户组',
  })
  async insUserGroups(@Body(
    new ParseArrayPipe({
      items: userGroupInsOneDto,
    }),
  ) dtos: userGroupInsOneDto[]): Promise<R> {
    return this.userGroupService.insUserGroups(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改用户组',
  })
  @Authorize({
    permission: 'sysManage:userGroup:upd',
    label: '修改用户组',
  })
  async updUserGroup(@Body() dto: userGroupUpdOneDto): Promise<R> {
    return this.userGroupService.updUserGroup(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改用户组',
  })
  @ApiBody({
    isArray: true,
    type: userGroupUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:userGroup:upds',
    label: '批量修改用户组',
  })
  async updUserGroups(@Body(
    new ParseArrayPipe({
      items: userGroupUpdOneDto,
    }),
  ) dtos: userGroupUpdOneDto[]): Promise<R> {
    return this.userGroupService.updUserGroups(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除用户组',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:userGroup:del',
    label: '删除用户组',
  })
  async delUserGroup(@Body() ids: number[]): Promise<R> {
    return this.userGroupService.delUserGroup(ids);
  }
}
