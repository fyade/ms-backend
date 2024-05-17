import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface userRoleDto extends insOneDto, baseInterface {
  id: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface insOneDto {
  userId: string;
  roleId: number;
  remark: string;
}

export interface insManyDto {
  userId: string;
  roleId: number[];
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}

export interface updManyDto extends insManyDto {
}
