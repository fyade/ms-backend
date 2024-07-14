import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class deptPermissionDto extends baseInterface {
  id: number;

  deptId: number;

  type: string;

  permissionId: number;

  remark: string;
}

export class deptPermissionSelListDto extends pageSelDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '部门id', required: false })
  deptId: number;

  @ApiProperty({ description: '接口类型', required: false })
  type: string;

  @ApiProperty({ description: '权限id', required: false })
  permissionId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptPermissionInsOneDto {
  @Type(() => Number)
  @IsNotEmpty({ message: '部门id不能为空' })
  deptId: number;

  @IsNotEmpty({ message: '接口类型不能为空' })
  type: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '权限id不能为空' })
  permissionId: number;

  remark: string;
}

export class deptPermissionSelAllDto {
  @ApiProperty({ description: '部门id', required: false })
  deptId: number;

  @ApiProperty({ description: '接口类型', required: false })
  type: string;

  @ApiProperty({ description: '权限id', required: false })
  permissionId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptPermissionUpdOneDto extends deptPermissionInsOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class deptPermissionUpdManyDPDto {
  @ApiProperty({ description: '部门id', required: true })
  deptId: number;

  @ApiProperty({ description: '权限id', required: true })
  permissionId: number[];
}
