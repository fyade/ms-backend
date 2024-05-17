import { baseInterface } from '../../../util/base';
import { pageSelDto } from '../../../common/dto/PageDto';

export interface dicDataDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface selAllDto extends insOneDto {
}

export interface insOneDto {
  label: string;
  value: string;
  dicType: string;
  ifDefault: string;
  ifDisabled: string;
  orderNum: number;
  remark?: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}