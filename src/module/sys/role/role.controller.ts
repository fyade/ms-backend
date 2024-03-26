import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Controller('/sys/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @Get()
  @Authorize('system:role:selList')
  async selRole(@Query() dto: selListDto): Promise<R> {
    return this.roleService.selRole(dto);
  }

  @Get("/all")
  @Authorize('system:role:selAll')
  async selAll(): Promise<R> {
    return this.roleService.selAll();
  }

  @Get(':id')
  @Authorize('system:role:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.roleService.selOne(id);
  }

  @Post()
  @Authorize('system:role:ins')
  async insRole(@Body() dto: insOneDto): Promise<R> {
    return this.roleService.insRole(dto);
  }

  @Put()
  @Authorize('system:role:upd')
  async updRole(@Body() dto: updOneDto): Promise<R> {
    return this.roleService.updRole(dto);
  }

  @Delete()
  @Authorize('system:role:del')
  async delRole(@Body() ids: any[]): Promise<R> {
    return this.roleService.delRole(ids);
  }
}
