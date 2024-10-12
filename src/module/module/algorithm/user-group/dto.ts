import { BaseDto } from '../../../../common/dto/BaseDto';
import { PageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserGroupDto extends BaseDto {
  id: number;

  label: string;

  parentId: number;

  orderNum: number;

  remark: string;
}

export class UserGroupSelListDto extends PageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '用户组名', required: false })
  label: string;

  @ApiProperty({ description: '父级用户组', required: false })
  parentId: number;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class UserGroupSelAllDto {
  @ApiProperty({ description: '用户组名', required: false })
  label: string;

  @ApiProperty({ description: '父级用户组', required: false })
  parentId: number;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class UserGroupInsOneDto {
  @ApiProperty({ description: '用户组名', required: true })
  @IsNotEmpty({ message: '用户组名不能为空' })
  label: string;

  @ApiProperty({ description: '父级用户组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '父级用户组不能为空' })
  parentId: number;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class UserGroupUpdOneDto extends UserGroupInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
