import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { R } from './common/R';
import { Authorize } from './decorator/authorizeDecorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from './pipe/validation/validation.pipe';

@Controller('/sys/base')
@ApiTags('系统')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get()
  @ApiOperation({
    summary: 'Hello World!',
  })
  async getHello(): Promise<R> {
    return await this.appService.getHello();
  }

  @Get('/v')
  @ApiOperation({
    summary: '获取系统版本信息',
  })
  @Authorize({
    permission: '-',
    label: '-',
    ifIgnore: true
  })
  async getVersion(): Promise<R> {
    return await this.appService.getVersion();
  }

  @Get('/apis')
  @ApiOperation({
    summary: '获取全部鉴权接口',
  })
  @Authorize({
    permission: 'system:home:apis',
    label: '获取全部鉴权接口',
  })
  async getAllAuthApis(): Promise<R> {
    return this.appService.getAllAuthApis();
  }

  @Get('/info')
  @ApiOperation({
    summary: '获取系统基本信息',
  })
  @Authorize({
    permission: 'system:home:base',
    label: '获取系统基本信息',
  })
  async getSystemUsingInfo(): Promise<R> {
    return this.appService.getSystemUsingInfo();
  }

  @Get('/permission/:sysId')
  @ApiOperation({
    summary: '获取有权限的页面',
  })
  @Authorize({
    permission: 'system:home:permission',
    label: '获取有权限的页面',
  })
  async getPermissions(@Param('sysId') sysId: number): Promise<R> {
    return this.appService.getPermissions(sysId);
  }

  @Get('/system')
  @ApiOperation({
    summary: '获取有权限的系统',
  })
  @Authorize({
    permission: 'system:home:system',
    label: '获取有权限的系统',
  })
  async getSystems(): Promise<R> {
    return this.appService.getSystems();
  }
}
