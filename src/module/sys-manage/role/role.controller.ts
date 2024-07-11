import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { RoleService } from './role.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/role')
@ApiTags('角色')
@UsePipes(new ValidationPipe())
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @Get()
  @Authorize({
    permission: 'sysManage:role:selList',
    label: '分页查询角色',
  })
  async selRole(@Query() dto: selListDto): Promise<R> {
    return this.roleService.selRole(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:role:selAll',
    label: '查询所有角色',
  })
  async selAll(@Query() dto: selAllDto): Promise<R> {
    return this.roleService.selAll(dto);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:role:selOne',
    label: '查询单个角色',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.roleService.selOne(id);
  }

  @Post()
  @Authorize({
    permission: 'sysManage:role:ins',
    label: '新增角色',
  })
  async insRole(@Body() dto: insOneDto): Promise<R> {
    return this.roleService.insRole(dto);
  }

  @Put()
  @Authorize({
    permission: 'sysManage:role:upd',
    label: '修改角色',
  })
  async updRole(@Body() dto: updOneDto): Promise<R> {
    return this.roleService.updRole(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:role:del',
    label: '删除角色',
  })
  async delRole(@Body() ids: any[]): Promise<R> {
    return this.roleService.delRole(ids);
  }
}
