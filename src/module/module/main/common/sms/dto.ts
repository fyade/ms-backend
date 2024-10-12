import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SmsSendDto1 {
  @ApiProperty({ description: '内容', required: true })
  @IsNotEmpty({ message: '内容不能为空' })
  msg: string;
}

export class SmsSendDto2 {
  from: string;
  to: string;
  params: EquipName;
  remark: string;
}

class EquipName {
  name: string;
  power: string;
}
