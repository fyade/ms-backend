import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { selAllDto, selListDto, updManyRUDto, updManyURDto } from './dto';
import { R } from '../../../common/R';
import { UserRoleService } from './user-role.service';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/user-role')
@ApiTags('用户角色')
@UsePipes(new ValidationPipe())
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {
  }

  @Get()
  @Authorize({
    permission: 'sysManage:userRole:selList',
    label: '分页查询用户角色',
  })
  async selUserRole(@Query() dto: selListDto): Promise<R> {
    return this.userRoleService.selUserRole(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:userRole:selAll',
    label: '查询所有用户角色',
  })
  async selAll(@Query() dto: selAllDto): Promise<R> {
    return this.userRoleService.selAll(dto);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:userRole:selOne',
    label: '查询单个用户角色',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.userRoleService.selOne(id);
  }

  @Post('/ur')
  @Authorize({
    permission: 'sysManage:userRole:updur',
    label: '更新用户角色（ur）',
  })
  async updUserRoleUR(@Body() dto: updManyURDto): Promise<R> {
    return this.userRoleService.updUserRoleUR(dto);
  }

  @Post('/ru')
  @Authorize({
    permission: 'sysManage:userRole:updru',
    label: '更新用户角色（ru）',
  })
  async updUserRoleRU(@Body() dto: updManyRUDto): Promise<R> {
    return this.userRoleService.updUserRoleRU(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:userRole:del',
    label: '删除用户角色',
  })
  async delUserRole(@Body() ids: any[]): Promise<R> {
    return this.userRoleService.delUserRole(ids);
  }
}
