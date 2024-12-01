import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserVisitorDto extends BaseDto {
  id: string;

  username: string;

  nickname: string;

  password: string;

  avatar: string;

  sex: string;

  email: string;

  tel: string;
}

export class UserVisitorSelListDto extends PageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: string;

  @ApiProperty({ description: '用户名', required: false })
  username: string;

  @ApiProperty({ description: '昵称', required: false })
  nickname: string;

  @ApiProperty({ description: '性别', required: false })
  sex: string;

  @ApiProperty({ description: '查询是否带权限', required: false })
  ifWithRole: string;
}

export class UserVisitorSelAllDto {
  @ApiProperty({ description: '用户名', required: false })
  username: string;

  @ApiProperty({ description: '昵称', required: false })
  nickname: string;

  @ApiProperty({ description: '密码', required: false })
  password: string;

  @ApiProperty({ description: '头像', required: false })
  avatar: string;

  @ApiProperty({ description: '性别', required: false })
  sex: string;

  @ApiProperty({ description: '邮箱', required: false })
  email: string;

  @ApiProperty({ description: '电话', required: false })
  tel: string;
}

export class UserVisitorInsOneDto {
  @ApiProperty({ description: '用户名', required: true })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '昵称', required: true })
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '头像', required: true })
  @IsNotEmpty({ message: '头像不能为空' })
  avatar: string;

  @ApiProperty({ description: '性别', required: true })
  @IsNotEmpty({ message: '性别不能为空' })
  sex: string;

  @ApiProperty({ description: '邮箱', required: true })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '电话', required: true })
  @IsNotEmpty({ message: '电话不能为空' })
  tel: string;
}

export class UserVisitorUpdOneDto extends UserVisitorInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: string;
}

export class AdminNewUserVisitorDto {
  @ApiProperty({ description: '用户名', required: true })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '密码类型，a:未加密/b:AES对称加密', required: true })
  @IsNotEmpty({ message: '密码类型不能为空' })
  psdType: string;
}

export class ResetUserVisitorPsdDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '密码类型，a:未加密/b:AES对称加密', required: true })
  @IsNotEmpty({ message: '密码类型不能为空' })
  psdType: string;
}
