import { Controller, Get, UsePipes } from '@nestjs/common';
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
  async getBaseInfo(): Promise<R> {
    return this.appService.getBaseInfo();
  }
}
