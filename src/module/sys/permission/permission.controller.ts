import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { PermissionService } from './permission.service';

@Controller('sys/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @Get()
  @Authorize('system:permission:selList')
  async selPermission(@Query() dto: selListDto): Promise<R> {
    return this.permissionService.selPermission(dto);
  }

  @Get(':id')
  @Authorize('system:permission:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.permissionService.selOne(id);
  }

  @Post()
  @Authorize('system:permission:ins')
  async insPermission(@Body() dto: insOneDto): Promise<R> {
    return this.permissionService.insPermission(dto);
  }

  @Put()
  @Authorize('system:permission:upd')
  async updPermission(@Body() dto: updOneDto): Promise<R> {
    return this.permissionService.updPermission(dto);
  }

  @Delete()
  @Authorize('system:permission:del')
  async delPermission(@Body() ids: any[]): Promise<R> {
    return this.permissionService.delPermission(ids);
  }
}
