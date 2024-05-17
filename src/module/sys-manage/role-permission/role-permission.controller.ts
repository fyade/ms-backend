import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insManyDto, selByRoleIdDto, selListDto, updManyDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { RolePermissionService } from './role-permission.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sys-manage/role-permission')
@ApiTags('角色权限')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {
  }

  @Get()
  @Authorize('sysManage:rolePermission:selList')
  async selRolePermission(@Query() dto: selListDto): Promise<R> {
    return this.rolePermissionService.selRolePermission(dto);
  }

  @Get('/all')
  @Authorize('sysManage:rolePermission:selAll')
  async selAll(@Query() dto: selByRoleIdDto): Promise<R> {
    return this.rolePermissionService.selAll({
      roleId: dto.roleId ? Number(dto.roleId) : dto.roleId,
    });
  }

  @Get('/:id')
  @Authorize('sysManage:rolePermission:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.rolePermissionService.selOne(id);
  }

  @Post()
  @Authorize('sysManage:rolePermission:ins')
  async insRolePermission(@Body() dto: insManyDto): Promise<R> {
    return this.rolePermissionService.insRolePermission(dto);
  }

  @Put()
  @Authorize('sysManage:rolePermission:upd')
  async updRolePermission(@Body() dto: updManyDto): Promise<R> {
    return this.rolePermissionService.updRolePermission(dto);
  }

  @Delete()
  @Authorize('sysManage:rolePermission:del')
  async delRolePermission(@Body() ids: any[]): Promise<R> {
    return this.rolePermissionService.delRolePermission(ids);
  }
}
