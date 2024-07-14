import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { SmsService } from './sms.service';
import { R } from '../../../common/R';
import { smsSendDto1 } from './dto';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys/sms')
@ApiTags('腾讯云sms')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class SmsController {
  constructor(private readonly smsService: SmsService) {
  }

  @Post('/1')
  @ApiOperation({
    summary: '发送短信1',
  })
  @Authorize('system:sms:send')
  async send(@Body() dto: smsSendDto1): Promise<R> {
    return this.smsService.send1(dto);
  }
}
