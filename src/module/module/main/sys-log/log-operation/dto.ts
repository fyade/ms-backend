import { pageDto } from '../../../../../common/dto/PageDto';
import { baseInterface } from '../../../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class logOperationDto extends baseInterface {
  id: number;

  perms: string;

  userId: string;

  reqParam: string;

  oldValue: string;

  operateType: string;

  ifSuccess: string;

  remark: string;
}

export class logOperationSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '权限标识', required: false })
  perms: string;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '请求参数', required: false })
  reqParam: string;

  @ApiProperty({ description: '旧值', required: false })
  oldValue: string;

  @ApiProperty({ description: '操作类型', required: false })
  operateType: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class logOperationSelAllDto {
  @ApiProperty({ description: '权限标识', required: false })
  perms: string;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '请求参数', required: false })
  reqParam: string;

  @ApiProperty({ description: '旧值', required: false })
  oldValue: string;

  @ApiProperty({ description: '操作类型', required: false })
  operateType: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class logOperationInsOneDto {
  @ApiProperty({ description: '权限标识', required: true })
  @IsNotEmpty({ message: '权限标识不能为空' })
  perms: string;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: string;

  @ApiProperty({ description: '请求参数', required: true })
  @IsNotEmpty({ message: '请求参数不能为空' })
  reqParam: string;

  @ApiProperty({ description: '旧值', required: true })
  @IsNotEmpty({ message: '旧值不能为空' })
  oldValue: string;

  @ApiProperty({ description: '操作类型', required: true })
  @IsNotEmpty({ message: '操作类型不能为空' })
  operateType: string;

  @ApiProperty({ description: '是否成功', required: true })
  @IsNotEmpty({ message: '是否成功不能为空' })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class logOperationUpdOneDto extends logOperationInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
