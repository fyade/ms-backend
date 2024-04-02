import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insManyDto, selByRoleIdDto, selListDto, updManyDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { RolePermissionService } from './role-permission.service';

@Controller('/sys/role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {
  }

  @Get()
  @Authorize('system:rolePermission:selList')
  async selRolePermission(@Query() dto: selListDto): Promise<R> {
    return this.rolePermissionService.selRolePermission(dto);
  }

  @Get('/all')
  @Authorize('system:rolePermission:selAll')
  async selAll(@Query() dto: selByRoleIdDto): Promise<R> {
    return this.rolePermissionService.selAll({
      role_id: dto.role_id ? Number(dto.role_id) : dto.role_id,
    });
  }

  @Get('/:id')
  @Authorize('system:rolePermission:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.rolePermissionService.selOne(id);
  }

  @Post()
  @Authorize('system:rolePermission:ins')
  async insRolePermission(@Body() dto: insManyDto): Promise<R> {
    return this.rolePermissionService.insRolePermission(dto);
  }

  @Put()
  @Authorize('system:rolePermission:upd')
  async updRolePermission(@Body() dto: updManyDto): Promise<R> {
    return this.rolePermissionService.updRolePermission(dto);
  }

  @Delete()
  @Authorize('system:rolePermission:del')
  async delRolePermission(@Body() ids: any[]): Promise<R> {
    return this.rolePermissionService.delRolePermission(ids);
  }
}
