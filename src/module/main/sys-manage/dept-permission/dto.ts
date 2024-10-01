import { pageDto } from '../../../../common/dto/PageDto';
import { baseInterface } from '../../../../common/commonType';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class deptPermissionDto extends baseInterface {
  id: number;

  deptId: number;

  type: string;

  permissionId: number;

  remark: string;
}

export class deptPermissionSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '部门', required: false })
  deptId: number;

  @ApiProperty({ description: '权限类型', required: false })
  type: string;

  @ApiProperty({ description: '权限', required: false })
  permissionId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptPermissionSelAllDto {
  @ApiProperty({ description: '部门', required: false })
  deptId: number;

  @ApiProperty({ description: '权限类型', required: false })
  type: string;

  @ApiProperty({ description: '权限', required: false })
  permissionId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptPermissionInsOneDto {
  @ApiProperty({ description: '部门', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '部门不能为空' })
  deptId: number;

  @ApiProperty({ description: '权限类型', required: true })
  @IsNotEmpty({ message: '权限类型不能为空' })
  type: string;

  @ApiProperty({ description: '权限', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '权限不能为空' })
  permissionId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptPermissionUpdOneDto extends deptPermissionInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class deptPermissionUpdManyDPDto {
  @ApiProperty({ description: '部门', required: true })
  @IsNotEmpty({ message: '部门不能为空' })
  deptId: number;

  @ApiProperty({ description: '权限', required: true })
  @IsArray({ message: '权限应为数组' })
  permissionId: number[];
}
