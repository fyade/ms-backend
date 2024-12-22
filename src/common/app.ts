import { PreAuthorizeParams } from '../decorator/customDecorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class sonProjAuthDto {
  @ApiProperty({ description: '请求权限参数', required: true })
  @IsNotEmpty({ message: '请求权限参数不能为空' })
  authorizeParams: PreAuthorizeParams;

  @ApiProperty({ description: 'token', required: true })
  @IsNotEmpty({ message: 'token不能为空' })
  token: string;
}
