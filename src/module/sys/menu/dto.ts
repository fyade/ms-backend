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
  type: string;
  path: string;
  parent_id: number;
  component: string;
  icon: string;
  order_num: number;
  if_link: string;
  if_visible: string;
  if_disabled: string;
  if_public: string;
  perms: string;
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}
