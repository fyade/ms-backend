import { pageDto } from '../../../../common/dto/PageDto';
import { baseInterface } from '../../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class deptDto extends baseInterface {
  id: number;

  label: string;

  ifAdmin: string;

  ifDisabled: string;

  parentId: number;

  orderNum: number;

  remark: string;
}

export class deptSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '部门名', required: false })
  label: string;

  @ApiProperty({ description: '是否管理员权限', required: false })
  ifAdmin: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '父级部门', required: false })
  parentId: number;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptSelAllDto {
  @ApiProperty({ description: '部门名', required: false })
  label: string;

  @ApiProperty({ description: '是否管理员权限', required: false })
  ifAdmin: string;

  @ApiProperty({ description: '是否禁用', required: false })
  ifDisabled: string;

  @ApiProperty({ description: '父级部门', required: false })
  parentId: number;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptInsOneDto {
  @ApiProperty({ description: '部门名', required: true })
  @IsNotEmpty({ message: '部门名不能为空' })
  label: string;

  @ApiProperty({ description: '是否管理员权限', required: true })
  @IsNotEmpty({ message: '是否管理员权限不能为空' })
  ifAdmin: string;

  @ApiProperty({ description: '是否禁用', required: true })
  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @ApiProperty({ description: '父级部门', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '父级部门不能为空' })
  parentId: number;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptUpdOneDto extends deptInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
