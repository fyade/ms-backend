import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserDeptService } from './user-dept.service';
import { Authorize } from '../../../../decorator/authorizeDecorator';
import { R } from '../../../../common/R';
import { ValidationPipe } from '../../../../pipe/validation/validation.pipe';
import {
  userDeptSelListDto,
  userDeptSelAllDto,
  userDeptInsOneDto,
  userDeptUpdOneDto,
  userDeptUpdUDDto,
  userDeptUpdDUDto,
} from './dto';

@Controller('/main/sys-manage/user-dept')
@ApiTags('主系统/系统管理/用户部门')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class UserDeptController {
  constructor(private readonly userDeptService: UserDeptService) {
  }

  @Get()
  @ApiOperation({
    summary: '分页查询用户部门',
  })
  @Authorize({
    permission: 'main:sysManage:userDept:selList',
    label: '分页查询用户部门',
  })
  async selUserDept(@Query() dto: userDeptSelListDto): Promise<R> {
    return this.userDeptService.selUserDept(dto);
  }

  @Get('/all')
  @ApiOperation({
    summary: '查询所有用户部门',
  })
  @Authorize({
    permission: 'main:sysManage:userDept:selAll',
    label: '查询所有用户部门',
  })
  async selAllUserDept(@Query() dto: userDeptSelAllDto): Promise<R> {
    return this.userDeptService.selAllUserDept(dto);
  }

  @Get('/ids')
  @ApiOperation({
    summary: '查询多个用户部门（根据id）',
  })
  @ApiQuery({
    name: 'ids',
    description: 'id列表',
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'main:sysManage:userDept:selOnes',
    label: '查询多个用户部门（根据id）',
  })
  async selOnesUserDept(@Query() ids: number[]): Promise<R> {
    return this.userDeptService.selOnesUserDept(ids);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '查询单个用户部门',
  })
  @Authorize({
    permission: 'main:sysManage:userDept:selOne',
    label: '查询单个用户部门',
  })
  async selOneUserDept(@Param('id') id: number): Promise<R> {
    return this.userDeptService.selOneUserDept(id);
  }

  @Post('/ud')
  @ApiOperation({
    summary: '更新用户部门（ud）',
  })
  @Authorize({
    permission: 'main:sysManage:userDept:updud',
    label: '更新用户部门（ud）',
  })
  async updUserDeptUD(@Body() dto: userDeptUpdUDDto): Promise<R> {
    return this.userDeptService.updUserDeptUD(dto);
  }

  @Post('/du')
  @ApiOperation({
    summary: '更新用户部门（du）',
  })
  @Authorize({
    permission: 'main:sysManage:userDept:upddu',
    label: '更新用户部门（du）',
  })
  async updUserDeptDU(@Body() dto: userDeptUpdDUDto): Promise<R> {
    return this.userDeptService.updUserDeptDU(dto);
  }

  @Delete()
  @ApiOperation({
    summary: '删除用户部门',
  })
  @ApiBody({
    isArray: true,
    type: Number,
  })
  @Authorize({
    permission: 'main:sysManage:userDept:del',
    label: '删除用户部门',
  })
  async delUserDept(@Body() ids: number[]): Promise<R> {
    return this.userDeptService.delUserDept(ids);
  }
}
