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
  @Authorize('sysManage:role:selList')
  async selRole(@Query() dto: selListDto): Promise<R> {
    return this.roleService.selRole(dto);
  }

  @Get('/all')
  @Authorize('sysManage:role:selAll')
  async selAll(@Query() dto: selAllDto): Promise<R> {
    return this.roleService.selAll(dto);
  }

  @Get('/:id')
  @Authorize('sysManage:role:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.roleService.selOne(id);
  }

  @Post()
  @Authorize('sysManage:role:ins')
  async insRole(@Body() dto: insOneDto): Promise<R> {
    return this.roleService.insRole(dto);
  }

  @Put()
  @Authorize('sysManage:role:upd')
  async updRole(@Body() dto: updOneDto): Promise<R> {
    return this.roleService.updRole(dto);
  }

  @Delete()
  @Authorize('sysManage:role:del')
  async delRole(@Body() ids: any[]): Promise<R> {
    return this.roleService.delRole(ids);
  }
}
