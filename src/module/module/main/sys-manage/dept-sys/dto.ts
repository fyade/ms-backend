import { pageDto } from '../../../../../common/dto/PageDto';
import { baseInterface } from '../../../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class deptSysDto extends baseInterface {
  id: number;

  deptId: number;

  sysId: number;

  remark: string;
}

export class deptSysSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '部门', required: false })
  deptId: number;

  @ApiProperty({ description: '系统', required: false })
  sysId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptSysSelAllDto {
  @ApiProperty({ description: '部门', required: false })
  deptId: number;

  @ApiProperty({ description: '系统', required: false })
  sysId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptSysInsOneDto {
  @ApiProperty({ description: '部门', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '部门不能为空' })
  deptId: number;

  @ApiProperty({ description: '系统', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '系统不能为空' })
  sysId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class deptSysUpdOneDto extends deptSysInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
