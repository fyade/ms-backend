import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRoleService } from './user-role.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { userRoleSelAllDto, userRoleSelListDto, userRoleUpdManyRUDto, userRoleUpdManyURDto } from './dto';

@Controller('/sys-manage/user-role')
@ApiTags('用户角色')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户角色',
  })
  @Authorize({
    permission: 'sysManage:userRole:selList',
    label: '分页查询用户角色',
  })
  async selUserRole(@Query() dto: userRoleSelListDto): Promise<R> {
    return this.userRoleService.selUserRole(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有用户角色',
  })
  @Authorize({
    permission: 'sysManage:userRole:selAll',
    label: '查询所有用户角色',
  })
  async selAllUserRole(@Query() dto: userRoleSelAllDto): Promise<R> {
    return this.userRoleService.selAllUserRole(dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个用户角色',
  })
  @Authorize({
    permission: 'sysManage:userRole:selOne',
    label: '查询单个用户角色',
  })
  async selOneUserRole(@Param('id') id: number): Promise<R> {
    return this.userRoleService.selOneUserRole(id);
  }

  @Post('/ur')
  @ApiOperation({
    summary: '更新用户角色（ur）',
  })
  @Authorize({
    permission: 'sysManage:userRole:updur',
    label: '更新用户角色（ur）',
  })
  async updUserRoleUR(@Body() dto: userRoleUpdManyURDto): Promise<R> {
    return this.userRoleService.updUserRoleUR(dto);
  }

  @Post('/ru')
  @ApiOperation({
    summary: '更新用户角色（ru）',
  })
  @Authorize({
    permission: 'sysManage:userRole:updru',
    label: '更新用户角色（ru）',
  })
  async updUserRoleRU(@Body() dto: userRoleUpdManyRUDto): Promise<R> {
    return this.userRoleService.updUserRoleRU(dto);
  }

  @Delete()
  @ApiOperation({
    summary: '删除用户角色',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'sysManage:userRole:del',
    label: '删除用户角色',
  })
  async delUserRole(@Body() ids: any[]): Promise<R> {
    return this.userRoleService.delUserRole(ids);
  }
}
