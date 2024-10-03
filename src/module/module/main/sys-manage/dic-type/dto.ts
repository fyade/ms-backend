import { pageDto } from '../../../../../common/dto/PageDto';
import { baseInterface } from '../../../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class dicTypeDto extends baseInterface {
  id: number;

  name: string;

  type: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class dicTypeSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '字典名', required: false })
  name: string;

  @ApiProperty({ description: '字典类型', required: false })
  type: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class dicTypeSelAllDto {
  @ApiProperty({ description: '字典名', required: false })
  name: string;

  @ApiProperty({ description: '字典类型', required: false })
  type: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class dicTypeInsOneDto {
  @ApiProperty({ description: '字典名', required: true })
  @IsNotEmpty({ message: '字典名不能为空' })
  name: string;

  @ApiProperty({ description: '字典类型', required: true })
  @IsNotEmpty({ message: '字典类型不能为空' })
  type: string;

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

export class dicTypeUpdOneDto extends dicTypeInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
