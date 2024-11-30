import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDeptDto extends BaseDto {
  id: number;

  userId: string;

  deptId: number;
}

export class UserDeptSelListDto extends PageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '部门', required: false })
  deptId: number;
}

export class UserDeptSelAllDto {
  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '部门', required: false })
  deptId: number;
}

export class UserDeptInsOneDto {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '部门', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '部门不能为空' })
  deptId: number;
}

export class UserDeptUpdOneDto extends UserDeptInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class UserDeptUpdUDDto {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '部门', required: true })
  @IsArray({ message: '部门应为数组' })
  deptId: number[];
}

export class UserDeptUpdDUDto {
  @ApiProperty({ description: '用户', required: true })
  @IsArray({ message: '用户应为数组' })
  userId: string[];

  @ApiProperty({ description: '部门', required: true })
  @IsNotEmpty({ message: '部门不能为空' })
  deptId: number;
}
