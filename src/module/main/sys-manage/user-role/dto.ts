import { pageDto } from '../../../../common/dto/PageDto';
import { baseInterface } from '../../../../common/commonType';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class userRoleDto extends baseInterface {
  id: number;

  userId: string;

  roleId: number;

  remark: string;
}

export class userRoleSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '角色', required: false })
  roleId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userRoleSelAllDto {
  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '角色', required: false })
  roleId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userRoleInsOneDto {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '角色', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '角色不能为空' })
  roleId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userRoleUpdOneDto extends userRoleInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class userRoleUpdManyURDto {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '角色', required: true })
  @IsArray({ message: '角色应为数组' })
  roleId: number[];

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userRoleUpdManyRUDto {
  @ApiProperty({ description: '用户', required: true })
  @IsArray({ message: '用户应为数组' })
  userId: string[];

  @ApiProperty({ description: '角色', required: true })
  @IsNotEmpty({ message: '角色不能为空' })
  roleId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}
