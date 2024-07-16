import { pageDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class userDeptDto extends baseInterface {
  id: number;

  userId: string;

  deptId: number;

  remark: string;
}

export class userDeptSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '部门', required: false })
  deptId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userDeptSelAllDto {
  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '部门', required: false })
  deptId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userDeptInsOneDto {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '部门', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '部门不能为空' })
  deptId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userDeptUpdOneDto extends userDeptInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class userDeptUpdUDDto {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '部门', required: true })
  @IsArray({ message: '部门应为数组' })
  deptId: number[];

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userDeptUpdDUDto {
  @ApiProperty({ description: '用户', required: true })
  @IsArray({ message: '用户应为数组' })
  userId: string[];

  @ApiProperty({ description: '部门', required: true })
  @IsNotEmpty({ message: '部门不能为空' })
  deptId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}
