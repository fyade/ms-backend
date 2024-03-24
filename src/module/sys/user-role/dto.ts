import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface roleDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface insOneDto {
  user_id: string;
  role_id: number;
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}
