import { pageDto } from '../../../../common/dto/PageDto';
import { baseInterface } from '../../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class roleSysDto extends baseInterface {
  id: number;

  roleId: number;

  sysId: number;

  remark: string;
}

export class roleSysSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '角色', required: false })
  roleId: number;

  @ApiProperty({ description: '系统', required: false })
  sysId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class roleSysSelAllDto {
  @ApiProperty({ description: '角色', required: false })
  roleId: number;

  @ApiProperty({ description: '系统', required: false })
  sysId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class roleSysInsOneDto {
  @ApiProperty({ description: '角色', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '角色不能为空' })
  roleId: number;

  @ApiProperty({ description: '系统', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '系统不能为空' })
  sysId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class roleSysUpdOneDto extends roleSysInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
