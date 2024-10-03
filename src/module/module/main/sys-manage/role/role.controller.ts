import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { Authorize } from '../../../../../decorator/authorizeDecorator';
import { R } from '../../../../../common/R';
import { ValidationPipe } from '../../../../../pipe/validation/validation.pipe';
import { roleSelListDto, roleSelAllDto, roleInsOneDto, roleUpdOneDto } from './dto';

@Controller('/main/sys-manage/role')
@ApiTags('主系统/系统管理/角色')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询角色',
  })
  @Authorize({
    permission: 'main:sysManage:role:selList',
    label: '分页查询角色',
  })
  async selRole(@Query() dto: roleSelListDto): Promise<R> {
    return this.roleService.selRole(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有角色',
  })
  @Authorize({
    permission: 'main:sysManage:role:selAll',
    label: '查询所有角色',
  })
  async selAllRole(@Query() dto: roleSelAllDto): Promise<R> {
    return this.roleService.selAllRole(dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个角色',
  })
  @Authorize({
    permission: 'main:sysManage:role:selOne',
    label: '查询单个角色',
  })
  async selOneRole(@Param('id') id: number): Promise<R> {
    return this.roleService.selOneRole(id);
  }

  @Post()
  @ApiOperation({
    summary: '新增角色',
  })
  @Authorize({
    permission: 'main:sysManage:role:ins',
    label: '新增角色',
  })
  async insRole(@Body() dto: roleInsOneDto): Promise<R> {
    return this.roleService.insRole(dto);
  }

  @Put()
  @ApiOperation({
    summary: '修改角色',
  })
  @Authorize({
    permission: 'main:sysManage:role:upd',
    label: '修改角色',
  })
  async updRole(@Body() dto: roleUpdOneDto): Promise<R> {
    return this.roleService.updRole(dto);
  }

  @Delete()
  @ApiOperation({
    summary: '删除角色',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'main:sysManage:role:del',
    label: '删除角色',
  })
  async delRole(@Body() ids: number[]): Promise<R> {
    return this.roleService.delRole(ids);
  }
}
