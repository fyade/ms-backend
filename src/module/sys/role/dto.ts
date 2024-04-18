import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface roleDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface selListDto2 {
  id: number;
}

export interface insOneDto {
  label: string;
  if_admin: string;
  if_disabled: string;
  order_num: number;
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}
