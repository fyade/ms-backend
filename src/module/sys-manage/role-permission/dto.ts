import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface rolePermissionDto extends insOneDto, baseInterface {
  id: number;
}

export interface selByRoleIdDto {
  role_id?: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface insOneDto {
  type: string;
  role_id: number;
  permission_id: number;
  remark: string;
}

export interface insManyDto {
  role_id: number;
  permission_id: number[];
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}

export interface updManyDto extends insManyDto {
}
