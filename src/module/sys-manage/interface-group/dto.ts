import { pageDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../common/commonType';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class interfaceGroupDto extends baseInterface {
  id: number;

  label: string;

  parentId: number;

  orderNum: number;

  remark: string;
}

export class interfaceGroupSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '接口组名', required: false })
  label: string;

  @ApiProperty({ description: '父级接口组', required: false })
  parentId: number;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceGroupSelAllDto {
  @ApiProperty({ description: '接口组名', required: false })
  label: string;

  @ApiProperty({ description: '父级接口组', required: false })
  parentId: number;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceGroupInsOneDto {
  @ApiProperty({ description: '接口组名', required: true })
  @IsNotEmpty({ message: '接口组名不能为空' })
  label: string;

  @ApiProperty({ description: '父级接口组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '父级接口组不能为空' })
  parentId: number;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceGroupUpdOneDto extends interfaceGroupInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
