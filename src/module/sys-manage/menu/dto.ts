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
  parentId: number;
  component: string;
  icon: string;
  orderNum: number;
  ifLink: string;
  ifVisible: string;
  ifDisabled: string;
  ifPublic: string;
  perms: string;
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}
