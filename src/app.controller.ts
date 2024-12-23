import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { R } from './common/R';
import { Authorize } from './decorator/authorizeDecorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from './pipe/validation/validation.pipe';
import { sonProjAuthDto } from './common/app';

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
    label: '获取系统版本信息',
    ifIgnore: true,
  })
  async getVersion(): Promise<R> {
    return await this.appService.getVersion();
  }

  @Get('/system-base-info')
  @ApiOperation({
    summary: '获取系统基本信息',
  })
  @Authorize({
    permission: 'system:home:systemBaseInfo',
    label: '获取系统基本信息',
  })
  async getSystemUsingInfo(): Promise<R> {
    return this.appService.getSystemUsingInfo();
  }

  @Get('/system-all-apis')
  @ApiOperation({
    summary: '获取全部鉴权接口',
  })
  @Authorize({
    permission: 'system:home:systemAllApis',
    label: '获取全部鉴权接口',
  })
  async getAllAuthApis(): Promise<R> {
    return this.appService.getAllAuthApis();
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

  @Get('/page/:sysId')
  @ApiOperation({
    summary: '获取有权限的页面',
  })
  @Authorize({
    permission: 'system:home:page',
    label: '获取有权限的页面',
  })
  async getPages(@Param('sysId') sysId: number): Promise<R> {
    return this.appService.getPages(sysId);
  }

  @Get('/button/:sysId')
  @ApiOperation({
    summary: '获取有权限的按钮',
  })
  @Authorize({
    permission: 'system:home:button',
    label: '获取有权限的按钮',
  })
  async getButtons(@Param('sysId') sysId: number): Promise<R> {
    return this.appService.getButtons(sysId);
  }

  // @Post('/son-proj-auth')
  // @ApiOperation({
  //   summary: '子系统鉴权',
  // })
  // @Authorize({
  //   permission: 'system:home:sonProjAuth',
  //   label: '子系统鉴权',
  //   ifIgnore: true,
  // })
  // async sonProjAuth(@Body() dto: sonProjAuthDto): Promise<R> {
  //   return this.appService.sonProjAuth(dto);
  // }
}
