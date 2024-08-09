import { pageDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class logUserLoginDto extends baseInterface {
  id: number;

  userId: string;

  loginIp: string;

  loginPosition: string;

  loginBrowser: string;

  loginOs: string;

  ifSuccess: string;

  remark: string;
}

export class logUserLoginSelListDto extends pageDto {
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

export class logUserLoginSelAllDto {
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

export class logUserLoginInsOneDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: string;

  @ApiProperty({ description: '登录ip', required: false })
  loginIp: string;

  @ApiProperty({ description: '登录地', required: false })
  loginPosition: string;

  @ApiProperty({ description: '登录浏览器', required: false })
  loginBrowser: string;

  @ApiProperty({ description: '登录系统', required: false })
  loginOs: string;

  @ApiProperty({ description: '是否成功', required: true })
  @IsNotEmpty({ message: '是否成功不能为空' })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class logUserLoginUpdOneDto extends logUserLoginInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
