import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface menuDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface insOneDto {
  label: string;
  menu_id: number;
  order_num: number;
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}
