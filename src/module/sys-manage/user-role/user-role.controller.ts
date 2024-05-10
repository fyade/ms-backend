import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insManyDto, insOneDto, selListDto, updManyDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { UserRoleService } from './user-role.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sys-manage/user-role')
@ApiTags('用户角色')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {
  }

  @Get()
  @Authorize('sysManage:userRole:selList')
  async selUserRole(@Query() dto: selListDto): Promise<R> {
    return this.userRoleService.selUserRole(dto);
  }

  @Get('/:id')
  @Authorize('sysManage:userRole:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.userRoleService.selOne(id);
  }

  @Post()
  @Authorize('sysManage:userRole:ins')
  async insUserRole(@Body() dto: insManyDto): Promise<R> {
    return this.userRoleService.insUserRole(dto);
  }

  @Put()
  @Authorize('sysManage:userRole:upd')
  async updUserRole(@Body() dto: updManyDto): Promise<R> {
    return this.userRoleService.updUserRole(dto);
  }

  @Delete()
  @Authorize('sysManage:userRole:del')
  async delUserRole(@Body() ids: any[]): Promise<R> {
    return this.userRoleService.delUserRole(ids);
  }
}
