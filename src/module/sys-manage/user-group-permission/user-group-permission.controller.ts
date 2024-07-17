import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserGroupPermissionService } from './user-group-permission.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { userGroupPermissionSelListDto, userGroupPermissionSelAllDto, userGroupPermissionInsOneDto, userGroupPermissionUpdOneDto } from './dto';

@Controller('/sys-manage/user-group-permission')
@ApiTags('用户组接口组')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class UserGroupPermissionController {
  constructor(private readonly userGroupPermissionService: UserGroupPermissionService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户组接口组',
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:selList',
    label: '分页查询用户组接口组',
  })
  async selUserGroupPermission(@Query() dto: userGroupPermissionSelListDto): Promise<R> {
    return this.userGroupPermissionService.selUserGroupPermission(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有用户组接口组',
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:selAll',
    label: '查询所有用户组接口组',
  })
  async selAll(@Query() dto: userGroupPermissionSelAllDto): Promise<R> {
    return this.userGroupPermissionService.selAll(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个用户组接口组（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:selOnes',
    label: '查询多个用户组接口组（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.userGroupPermissionService.selOnes(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个用户组接口组',
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:selOne',
    label: '查询单个用户组接口组',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.userGroupPermissionService.selOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增用户组接口组',
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:ins',
    label: '新增用户组接口组',
  })
  async insUserGroupPermission(@Body() dto: userGroupPermissionInsOneDto): Promise<R> {
    return this.userGroupPermissionService.insUserGroupPermission(dto);
  }

  @Post('/s')
  @ApiOperation({
    summary: '批量新增用户组接口组',
  })
  @ApiBody({
    isArray: true,
    type: userGroupPermissionInsOneDto,
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:inss',
    label: '批量新增用户组接口组',
  })
  async insUserGroupPermissions(@Body(
    new ParseArrayPipe({
      items: userGroupPermissionInsOneDto,
    }),
  ) dtos: userGroupPermissionInsOneDto[]): Promise<R> {
    return this.userGroupPermissionService.insUserGroupPermissions(dtos);
  }

  @Put()
  @ApiOperation({
    summary: '修改用户组接口组',
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:upd',
    label: '修改用户组接口组',
  })
  async updUserGroupPermission(@Body() dto: userGroupPermissionUpdOneDto): Promise<R> {
    return this.userGroupPermissionService.updUserGroupPermission(dto);
  }

  @Put('/s')
  @ApiOperation({
    summary: '批量修改用户组接口组',
  })
  @ApiBody({
    isArray: true,
    type: userGroupPermissionUpdOneDto,
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:upds',
    label: '批量修改用户组接口组',
  })
  async updUserGroupPermissions(@Body(
    new ParseArrayPipe({
      items: userGroupPermissionUpdOneDto,
    }),
  ) dtos: userGroupPermissionUpdOneDto[]): Promise<R> {
    return this.userGroupPermissionService.updUserGroupPermissions(dtos);
  }

  @Delete()
  @ApiOperation({
    summary: '删除用户组接口组',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:userGroupPermission:del',
    label: '删除用户组接口组',
  })
  async delUserGroupPermission(@Body() ids: any[]): Promise<R> {
    return this.userGroupPermissionService.delUserGroupPermission(ids);
  }
}
