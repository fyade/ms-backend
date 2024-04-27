import { baseInterface } from '../../../util/base';
import { pageSelDto } from '../../../common/dto/PageDto';

export interface dicDataDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface insOneDto {
  label: string;
  value: string;
  dic_type: string;
  if_default: string;
  if_disabled: string;
  order_num: number;
  remark?: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}