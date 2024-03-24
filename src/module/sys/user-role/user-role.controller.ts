import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { insOneDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';
import { UserRoleService } from './user-role.service';

@Controller('sys/user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {
  }

  @Get()
  @Authorize('system:userRole:selList')
  async selUserRole(@Query() dto: selListDto): Promise<R> {
    return this.userRoleService.selUserRole(dto);
  }

  @Get(':id')
  @Authorize('system:userRole:selOne')
  async selOne(@Param('id') id: number): Promise<R> {
    return this.userRoleService.selOne(id);
  }

  @Post()
  @Authorize('system:userRole:ins')
  async insUserRole(@Body() dto: insOneDto): Promise<R> {
    return this.userRoleService.insUserRole(dto);
  }

  @Put()
  @Authorize('system:userRole:upd')
  async updUserRole(@Body() dto: updOneDto): Promise<R> {
    return this.userRoleService.updUserRole(dto);
  }

  @Delete()
  @Authorize('system:userRole:del')
  async delUserRole(@Body() ids: any[]): Promise<R> {
    return this.userRoleService.delUserRole(ids);
  }
}
