import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface codeGenColumnDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface selAllDto extends insOneDto {
}

export interface insOneDto {
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

export interface updOneDto extends insOneDto {
  id: number;
}