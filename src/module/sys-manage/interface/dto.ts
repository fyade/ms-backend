import { pageDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class interfaceDto extends baseInterface {
  id: number;

  label: string;

  icon: string;

  orderNum: number;

  ifDisabled: string;

  ifPublic: string;

  perms: string;

  remark: string;
}

export class interfaceSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '接口名', required: false })
  label: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '是否公共接口', required: false })
  ifPublic: string;

  @ApiProperty({ description: '权限标识', required: false })
  perms: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceSelAllDto {
  @ApiProperty({ description: '接口名', required: false })
  label: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '是否公共接口', required: false })
  ifPublic: string;

  @ApiProperty({ description: '权限标识', required: false })
  perms: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceInsOneDto {
  @ApiProperty({ description: '接口名', required: true })
  @IsNotEmpty({ message: '接口名不能为空' })
  label: string;

  @ApiProperty({ description: '图标', required: false })
  icon: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '是否禁用', required: true })
  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @ApiProperty({ description: '是否公共接口', required: true })
  @IsNotEmpty({ message: '是否公共接口不能为空' })
  ifPublic: string;

  @ApiProperty({ description: '权限标识', required: true })
  @IsNotEmpty({ message: '权限标识不能为空' })
  perms: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceUpdOneDto extends interfaceInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
