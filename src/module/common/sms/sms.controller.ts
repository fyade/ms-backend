import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { R } from '../../../common/R';
import { sendDto0 } from './dto';
import { Authorize } from '../../../decorator/authorizeDecorator';

@Controller('/sys/sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {
  }

  @Post('1')
  @Authorize('system:sms:send')
  async send(@Body() dto: sendDto0): Promise<R> {
    return this.smsService.send1(dto);
  }
}
