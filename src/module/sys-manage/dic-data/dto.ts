import { baseInterface } from '../../../util/base';
import { pageSelDto } from '../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class dicDataDto extends baseInterface {
  id: number;

  label: string;

  value: string;

  dicType: string;

  ifDefault: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class dicDataSelListDto extends pageSelDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '标签', required: false })
  label: string;

  @ApiProperty({ description: '值', required: false })
  value: string;

  @ApiProperty({ description: '字典类型', required: false })
  dicType: string;

  @ApiProperty({ description: '是否默认', required: false })
  ifDefault: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class dicDataInsOneDto {
  @ApiProperty({ description: '标签', required: true })
  @IsNotEmpty({ message: '标签不能为空' })
  label: string;

  @ApiProperty({ description: '值', required: true })
  @IsNotEmpty({ message: '值不能为空' })
  value: string;

  @ApiProperty({ description: '字典类型', required: true })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dicType: string;

  @ApiProperty({ description: '是否默认', required: true })
  @IsNotEmpty({ message: '是否默认不能为空' })
  ifDefault: string;

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

export class dicDataSelAllDto {
  @ApiProperty({ description: '标签', required: false })
  label: string;

  @ApiProperty({ description: '值', required: false })
  value: string;

  @ApiProperty({ description: '字典类型', required: false })
  dicType: string;

  @ApiProperty({ description: '是否默认', required: false })
  ifDefault: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class dicDataUpdOneDto extends dicDataInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
