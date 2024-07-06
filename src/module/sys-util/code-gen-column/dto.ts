import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class codeGenColumnDto extends baseInterface {
  id: number;

  tableId: number;

  colName: string;

  colDescr: string;

  mysqlType: string;

  tsType: string;

  tsName: string;

  ifIns: string;

  ifUpd: string;

  ifSelOne: string;

  ifSelMore: string;

  ifRequired: string;

  selType: string;

  formType: string;

  orderNum: number;
}

export class selListDto extends pageSelDto {
  id: number;

  @IsNotEmpty({ message: '所属表id不能为空' })
  tableId: number;

  colName: string;

  colDescr: string;

  mysqlType: string;

  tsType: string;

  tsName: string;

  ifIns: string;

  ifUpd: string;

  ifSelOne: string;

  ifSelMore: string;

  ifRequired: string;

  selType: string;

  formType: string;

  orderNum: number;
}

export class selAllDto {
  @Type(() => Number)
  tableId: number;

  colName: string;

  colDescr: string;

  mysqlType: string;

  tsType: string;

  tsName: string;

  ifIns: string;

  ifUpd: string;

  ifSelOne: string;

  ifSelMore: string;

  ifRequired: string;

  selType: string;

  formType: string;

  orderNum: number;
}

export class insOneDto {
  @IsNotEmpty({ message: '所属表id不能为空' })
  tableId: number;

  @IsNotEmpty({ message: '列名不能为空' })
  colName: string;

  @IsNotEmpty({ message: '字段描述不能为空' })
  colDescr: string;

  @IsNotEmpty({ message: 'mysql类型不能为空' })
  mysqlType: string;

  @IsNotEmpty({ message: 'ts类型不能为空' })
  tsType: string;

  @IsNotEmpty({ message: 'ts属性不能为空' })
  tsName: string;

  @IsNotEmpty({ message: '是否增不能为空' })
  ifIns: string;

  @IsNotEmpty({ message: '是否改不能为空' })
  ifUpd: string;

  @IsNotEmpty({ message: '是否查1不能为空' })
  ifSelOne: string;

  @IsNotEmpty({ message: '是否查n不能为空' })
  ifSelMore: string;

  @IsNotEmpty({ message: '是否必填不能为空' })
  ifRequired: string;

  @IsNotEmpty({ message: '查询方式不能为空' })
  selType: string;

  @IsNotEmpty({ message: '表单类型不能为空' })
  formType: string;

  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
