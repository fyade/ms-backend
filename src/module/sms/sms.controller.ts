import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from "./sms.service";
import { R } from "../../common/R";
import { sendDto0 } from "./dto";

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {
  }

  @Post('1')
  async send(@Body() dto: sendDto0): Promise<R> {
    return this.smsService.send1(dto);
  }
}
