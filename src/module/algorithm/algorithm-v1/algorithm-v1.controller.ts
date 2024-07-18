import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { AlgorithmV1Service } from './algorithm-v1.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';

@Controller('/algorithm-v1')
@ApiTags('算法接口')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class AlgorithmV1Controller {
  constructor(private readonly algorithmV1Service: AlgorithmV1Service) {
  }

  @Post('/hello-world')
  @ApiOperation({
    summary: '你好世界',
  })
  @Authorize({
    permission: 'algorithmV1:helloWorld',
    label: '你好世界',
    ifSF: true,
  })
  async helloWorld(@Body() dto: any): Promise<R> {
    return this.algorithmV1Service.helloWorld(dto);
  }

  @Post('/test')
  @ApiOperation({
    summary: '测试',
  })
  @Authorize({
    permission: 'algorithmV1:test',
    label: '测试接口',
    ifSF: true,
  })
  async test(@Body() dto: any): Promise<R> {
    return this.algorithmV1Service.test(dto);
  }
}
