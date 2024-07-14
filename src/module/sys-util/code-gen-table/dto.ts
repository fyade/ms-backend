import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class codeGenTableDto extends baseInterface {
  id: number;

  tableName: string;

  tableDescr: string;

  entityName: string;

  tableRemark: string;

  businessName: string;

  moduleName: string;

  orderNum: number;

  remark: string;
}

export class codeGenTableSelListDto extends pageSelDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '表名', required: false })
  tableName: string;

  @ApiProperty({ description: '表描述', required: false })
  tableDescr: string;

  @ApiProperty({ description: '实体类名', required: false })
  entityName: string;

  @ApiProperty({ description: '表备注', required: false })
  tableRemark: string;

  @ApiProperty({ description: '业务名', required: false })
  businessName: string;

  @ApiProperty({ description: '模块名', required: false })
  moduleName: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class codeGenTableSelAllDto {
  @ApiProperty({ description: '表名', required: false })
  tableName: string;

  @ApiProperty({ description: '表描述', required: false })
  tableDescr: string;

  @ApiProperty({ description: '实体类名', required: false })
  entityName: string;

  @ApiProperty({ description: '表备注', required: false })
  tableRemark: string;

  @ApiProperty({ description: '业务名', required: false })
  businessName: string;

  @ApiProperty({ description: '模块名', required: false })
  moduleName: string;

  @ApiProperty({ description: '顺序', required: false })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class codeGenTableInsOneDto {
  @ApiProperty({ description: '表名', required: true })
  @IsNotEmpty({ message: '表名不能为空' })
  tableName: string;

  @ApiProperty({ description: '表描述', required: true })
  @IsNotEmpty({ message: '表描述不能为空' })
  tableDescr: string;

  @ApiProperty({ description: '实体类名', required: true })
  @IsNotEmpty({ message: '实体类名不能为空' })
  entityName: string;

  @ApiProperty({ description: '表备注', required: false })
  tableRemark: string;

  @ApiProperty({ description: '业务名', required: true })
  @IsNotEmpty({ message: '业务名不能为空' })
  businessName: string;

  @ApiProperty({ description: '模块名', required: true })
  @IsNotEmpty({ message: '模块名不能为空' })
  moduleName: string;

  @ApiProperty({ description: '顺序', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class codeGenTableUpdOneDto extends codeGenTableInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
