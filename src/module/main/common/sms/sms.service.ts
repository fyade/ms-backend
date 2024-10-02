import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { smsSendDto1, smsSendDto2 } from './dto';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { currentEnv } from '../../../../../config/config';
import { base } from '../../../../util/base';
import { unitConversion } from '../../../../util/NumberUtils';
import { timeDiff } from '../../../../util/TimeUtils';

@Injectable()
export class SmsService {
  private env: any;

  constructor(private readonly prisma: PrismaService) {
    this.env = currentEnv();
  }
}
