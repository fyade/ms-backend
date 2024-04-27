import { baseInterface } from '../../../util/base';
import { pageSelDto } from '../../../common/dto/PageDto';

export interface dicTypeDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface selAllDto extends insOneDto {
}

export interface insOneDto {
  name: string;
  type: string;
  if_disabled: string;
  order_num: number;
  remark?: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}