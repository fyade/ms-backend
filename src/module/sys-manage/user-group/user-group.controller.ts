import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGroupService } from './user-group.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/user-group')
@ApiTags('2.8 用户组表')
@UsePipes(new ValidationPipe())
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {
  }

  @Get()
  @Authorize({
    permission: 'sysManage:userGroup:selList',
    label: '分页查询用户组',
  })
  async selUserGroup(@Query() dto: selListDto): Promise<R> {
    return this.userGroupService.selUserGroup(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:userGroup:selAll',
    label: '查询所有用户组',
  })
  async selAll(@Query() dto: selAllDto) {
    return this.userGroupService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysManage:userGroup:selOnes',
    label: '查询多个用户组（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.userGroupService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:userGroup:selOne',
    label: '查询单个用户组',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.userGroupService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysManage:userGroup:ins',
    label: '新增用户组',
  })
  async insUserGroup(@Body() dto: insOneDto): Promise<R> {
    return this.userGroupService.insUserGroup(dto);
  }

  @Post('/s')
  @Authorize({
    permission: 'sysManage:userGroup:inss',
    label: '批量新增用户组',
  })
  async insUserGroups(@Body(
    new ParseArrayPipe({
      items: insOneDto,
    }),
  ) dto: insOneDto[]): Promise<R> {
    return this.userGroupService.insUserGroups(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysManage:userGroup:upd',
    label: '修改用户组',
  })
  async updUserGroup(@Body() dto: updOneDto): Promise<R> {
    return this.userGroupService.updUserGroup(dto);
  }

  @Put('/s')
  @Authorize({
    permission: 'sysManage:userGroup:upds',
    label: '批量修改用户组',
  })
  async updUserGroups(@Body(
    new ParseArrayPipe({
      items: updOneDto,
    }),
  ) dto: updOneDto[]): Promise<R> {
    return this.userGroupService.updUserGroups(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:userGroup:del',
    label: '删除用户组',
  })
  async delUserGroup(@Body() ids: any[]): Promise<R> {
    return this.userGroupService.delUserGroup(ids);
  }
}
