import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface codeGenTableDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface selAllDto extends insOneDto {
}

export interface insOneDto {
  tableName: string;
  tableDescr: string;
  entityName: string;
  tableRemark?: string;
  moduleName: string;
  businessName: string;
  orderNum: number;
}

export interface updOneDto extends insOneDto {
  id: number;
}