import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insManyDto, selByRoleIdDto, selListDto, updManyDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { RolePermissionService } from './role-permission.service';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/role-permission')
@ApiTags('角色权限')
@UsePipes(new ValidationPipe())
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {
  }

  @Get()
  @Authorize({
    permission: 'sysManage:rolePermission:selList',
    label: '分页查询角色权限',
  })
  async selRolePermission(@Query() dto: selListDto): Promise<R> {
    return this.rolePermissionService.selRolePermission(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:rolePermission:selAll',
    label: '查询所有角色权限',
  })
  async selAll(@Query() dto: selByRoleIdDto): Promise<R> {
    return this.rolePermissionService.selAll({
      roleId: dto.roleId ? Number(dto.roleId) : dto.roleId,
    });
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:rolePermission:selOne',
    label: '查询单个角色权限',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.rolePermissionService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysManage:rolePermission:ins',
    label: '新增角色权限',
  })
  async insRolePermission(@Body() dto: insManyDto): Promise<R> {
    return this.rolePermissionService.insRolePermission(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysManage:rolePermission:upd',
    label: '修改角色权限',
  })
  async updRolePermission(@Body() dto: updManyDto): Promise<R> {
    return this.rolePermissionService.updRolePermission(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:rolePermission:del',
    label: '删除角色权限',
  })
  async delRolePermission(@Body() ids: any[]): Promise<R> {
    return this.rolePermissionService.delRolePermission(ids);
  }
}
