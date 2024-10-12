import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RolePermissionDto extends BaseDto {
  id: number;

  roleId: number;

  type: string;

  permissionId: number;

  remark: string;
}

export class RolePermissionSelListDto extends PageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '角色', required: false })
  roleId: number;

  @ApiProperty({ description: '权限类型', required: false })
  type: string;

  @ApiProperty({ description: '权限', required: false })
  permissionId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class RolePermissionSelAllDto {
  @ApiProperty({ description: '角色', required: false })
  roleId: number;

  @ApiProperty({ description: '权限类型', required: false })
  type: string;

  @ApiProperty({ description: '权限', required: false })
  permissionId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class RolePermissionSelByRoleIdDto {
  @ApiProperty({ description: '角色', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '角色不能为空' })
  roleId: number;
}

export class RolePermissionInsManyDto {
  @ApiProperty({ description: '角色', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '角色不能为空' })
  roleId: number;

  @ApiProperty({ description: '权限', required: true })
  @IsArray({ message: '权限应为数组' })
  permissionId: number[];

  @ApiProperty({ description: '权限类型', required: false })
    // @IsNotEmpty({ message: '权限类型不能为空' })
  type: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class RolePermissionUpdManyDto extends RolePermissionInsManyDto {
}

export class RolePermissionInsOneDto {
  @ApiProperty({ description: '角色', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '角色不能为空' })
  roleId: number;

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

export class RolePermissionUpdOneDto extends RolePermissionInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
