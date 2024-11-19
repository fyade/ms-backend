import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LogUserLoginDto extends BaseDto {
  id: number;

  userId: string;

  loginIp: string;

  loginPosition: string;

  loginBrowser: string;

  loginOs: string;

  ifSuccess: string;

  remark: string;
}

export class LogUserLoginSelListDto extends PageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '登录ip', required: false })
  loginIp: string;

  @ApiProperty({ description: '登录地', required: false })
  loginPosition: string;

  @ApiProperty({ description: '登录浏览器', required: false })
  loginBrowser: string;

  @ApiProperty({ description: '登录系统', required: false })
  loginOs: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogUserLoginSelAllDto {
  @ApiProperty({ description: '用户id', required: false })
  userId?: string;

  @ApiProperty({ description: '登录ip', required: false })
  loginIp?: string;

  @ApiProperty({ description: '登录地', required: false })
  loginPosition?: string;

  @ApiProperty({ description: '登录浏览器', required: false })
  loginBrowser?: string;

  @ApiProperty({ description: '登录系统', required: false })
  loginOs?: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess?: string;

  @ApiProperty({ description: '备注', required: false })
  remark?: string;
}

export class LogUserLoginInsOneDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: string;

  @ApiProperty({ description: '登录ip', required: true })
  @IsNotEmpty({ message: '登录ip不能为空' })
  loginIp: string;

  @ApiProperty({ description: '登录地', required: true })
  @IsNotEmpty({ message: '登录地不能为空' })
  loginPosition: string;

  @ApiProperty({ description: '登录浏览器', required: true })
  @IsNotEmpty({ message: '登录浏览器不能为空' })
  loginBrowser: string;

  @ApiProperty({ description: '登录系统', required: true })
  @IsNotEmpty({ message: '登录系统不能为空' })
  loginOs: string;

  @ApiProperty({ description: '是否成功', required: true })
  @IsNotEmpty({ message: '是否成功不能为空' })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogUserLoginUpdOneDto extends LogUserLoginInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
