import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class smsSendDto1 {
  @ApiProperty({ description: '内容', required: true })
  @IsNotEmpty({ message: '内容不能为空' })
  msg: string;
}

export class smsSendDto2 {
  from: string;
  to: string;
  params: equipName;
  remark: string;
}

class equipName {
  name: string;
  power: string;
}
