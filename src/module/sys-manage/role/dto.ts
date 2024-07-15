import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class roleDto extends baseInterface {
  id: number;

  label: string;

  ifAdmin: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class roleSelListDto extends pageSelDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '角色名', required: false })
  label: string;

  @ApiProperty({ description: '是否管理员权限', required: false })
  ifAdmin: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class roleSelAllDto {
  @ApiProperty({ description: '角色名', required: false })
  label: string;

  @ApiProperty({ description: '是否管理员权限', required: false })
  ifAdmin: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class roleInsOneDto {
  @ApiProperty({ description: '角色名', required: true })
  @IsNotEmpty({ message: '角色名不能为空' })
  label: string;

  @ApiProperty({ description: '是否管理员权限', required: true })
  @IsNotEmpty({ message: '是否管理员权限不能为空' })
  ifAdmin: string;

  @ApiProperty({ description: '是否禁用', required: true })
  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class roleUpdOneDto extends roleInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
