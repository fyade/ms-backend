import { pageDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class userUserGroupDto extends baseInterface {
  id: number;

  userId: string;

  userGroupId: number;

  remark: string;
}

export class userUserGroupSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '用户组', required: false })
  userGroupId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userUserGroupSelAllDto {
  @ApiProperty({ description: '用户', required: false })
  userId: string;

  @ApiProperty({ description: '用户组', required: false })
  userGroupId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userUserGroupInsOneDto {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '用户组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '用户组不能为空' })
  userGroupId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userUserGroupUpdOneDto extends userUserGroupInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class userUserGroupUpdUUGDtp {
  @ApiProperty({ description: '用户', required: true })
  @IsNotEmpty({ message: '用户不能为空' })
  userId: string;

  @ApiProperty({ description: '用户组', required: true })
  @Type(() => Number)
  @IsArray({ message: '用户组应为数组' })
  userGroupId: number[];

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class userUserGroupUpdUGUDtp {
  @ApiProperty({ description: '用户', required: true })
  @IsArray({ message: '用户应为数组' })
  userId: string[];

  @ApiProperty({ description: '用户组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '用户组不能为空' })
  userGroupId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}
