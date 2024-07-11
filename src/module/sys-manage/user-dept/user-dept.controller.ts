import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDeptService } from './user-dept.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { selAllDto, selListDto, userDeptUpdDUDto, userDeptUpdUDDto } from './dto';
import { R } from '../../../common/R';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-manage/user-dept')
@ApiTags('2.6 用户部门表')
@UsePipes(new ValidationPipe())
export class UserDeptController {
  constructor(private readonly userDeptService: UserDeptService) {
  }

  @Get()
  @Authorize({
    permission: 'sysManage:userDept:selList',
    label: '分页查询用户部门',
  })
  async selUserDept(@Query() dto: selListDto): Promise<R> {
    return this.userDeptService.selUserDept(dto);
  }

  @Get('/all')
  @Authorize({
    permission: 'sysManage:userDept:selAll',
    label: '查询所有用户部门',
  })
  async selAll(@Query() dto: selAllDto) {
    return this.userDeptService.selAll(dto);
  }

  @Get('/ids')
  @Authorize({
    permission: 'sysManage:userDept:selOnes',
    label: '查询多个用户部门（根据id）',
  })
  async selOnes(@Query() ids: any[]): Promise<R> {
    return this.userDeptService.selOnes(ids);
  }

  @Get('/:id')
  @Authorize({
    permission: 'sysManage:userDept:selOne',
    label: '查询单个用户部门',
  })
  async selOne(@Param('id') id: number): Promise<R> {
    return this.userDeptService.selOne(id);
  }

  @Post('/ud')
  @Authorize({
    permission: 'sysManage:userDept:updud',
    label: '更新用户部门（ud）',
  })
  async updUserDeptUD(@Body() dto: userDeptUpdUDDto): Promise<R> {
    return this.userDeptService.updUserDeptUD(dto);
  }

  @Post('/du')
  @Authorize({
    permission: 'sysManage:userDept:upddu',
    label: '更新用户部门（du）',
  })
  async updUserDeptDU(@Body() dto: userDeptUpdDUDto): Promise<R> {
    return this.userDeptService.updUserDeptDU(dto);
  }

  @Delete()
  @Authorize({
    permission: 'sysManage:userDept:del',
    label: '删除用户部门',
  })
  async delUserDept(@Body() ids: any[]): Promise<R> {
    return this.userDeptService.delUserDept(ids);
  }
}
