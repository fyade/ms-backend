import { pageDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class userGroupPermissionDto extends baseInterface {
  id: number;

  userGroupId: number;

  permissionId: number;

  ifLongTerm: string;

  ifLimitRequestTimes: string;

  ifRejectRequestUseUp: string;

  permissionStartTime: string;

  permissionEndTime: string;

  limitRequestTimes: number;

  ifUseUp: string;

  orderNum: number;

  remark: string;
}

export class userGroupPermissionSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '用户组', required: false })
  userGroupId: number;

  @ApiProperty({ description: '接口组', required: false })
  permissionId: number;

  @ApiProperty({ description: '是否长期权限', required: false })
  ifLongTerm: string;

  @ApiProperty({ description: '是否限制次数', required: false })
  ifLimitRequestTimes: string;

  @ApiProperty({ description: '次数用尽后是否拒绝请求', required: false })
  ifRejectRequestUseUp: string;

  @ApiProperty({ description: '权限开始时间', required: false })
  permissionStartTime: string;

  @ApiProperty({ description: '权限结束时间', required: false })
  permissionEndTime: string;

  @ApiProperty({ description: '请求限制次数', required: false })
  limitRequestTimes: number;

  @ApiProperty({ description: '是否已用尽', required: false })
  ifUseUp: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userGroupPermissionSelAllDto {
  @ApiProperty({ description: '用户组', required: false })
  userGroupId: number;

  @ApiProperty({ description: '接口组', required: false })
  permissionId: number;

  @ApiProperty({ description: '是否长期权限', required: false })
  ifLongTerm: string;

  @ApiProperty({ description: '是否限制次数', required: false })
  ifLimitRequestTimes: string;

  @ApiProperty({ description: '次数用尽后是否拒绝请求', required: false })
  ifRejectRequestUseUp: string;

  @ApiProperty({ description: '权限开始时间', required: false })
  permissionStartTime: string;

  @ApiProperty({ description: '权限结束时间', required: false })
  permissionEndTime: string;

  @ApiProperty({ description: '请求限制次数', required: false })
  limitRequestTimes: number;

  @ApiProperty({ description: '是否已用尽', required: false })
  ifUseUp: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userGroupPermissionInsOneDto {
  @ApiProperty({ description: '用户组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '用户组不能为空' })
  userGroupId: number;

  @ApiProperty({ description: '接口组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '接口组不能为空' })
  permissionId: number;

  @ApiProperty({ description: '是否长期权限', required: true })
  @IsNotEmpty({ message: '是否长期权限不能为空' })
  ifLongTerm: string;

  @ApiProperty({ description: '是否限制次数', required: true })
  @IsNotEmpty({ message: '是否限制次数不能为空' })
  ifLimitRequestTimes: string;

  @ApiProperty({ description: '次数用尽后是否拒绝请求', required: true })
  @IsNotEmpty({ message: '次数用尽后是否拒绝请求不能为空' })
  ifRejectRequestUseUp: string;

  @ApiProperty({ description: '权限开始时间', required: true })
  @IsNotEmpty({ message: '权限开始时间不能为空' })
  permissionStartTime: string;

  @ApiProperty({ description: '权限结束时间', required: true })
  @IsNotEmpty({ message: '权限结束时间不能为空' })
  permissionEndTime: string;

  @ApiProperty({ description: '请求限制次数', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '请求限制次数不能为空' })
  limitRequestTimes: number;

  @ApiProperty({ description: '是否已用尽', required: false })
  ifUseUp: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userGroupPermissionUpdOneDto extends userGroupPermissionInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
