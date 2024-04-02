import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { R } from './common/R';
import { Authorize } from './decorator/authorizeDecorator';

@Controller('/sys')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get()
  async getHello(): Promise<R> {
    return await this.appService.getHello();
  }

  @Get('/base')
  @Authorize('system:home:base')
  async getBaseInfo(): Promise<R> {
    return this.appService.getBaseInfo();
  }
}
