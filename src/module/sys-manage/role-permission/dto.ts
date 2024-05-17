import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';

export interface rolePermissionDto extends insOneDto, baseInterface {
  id: number;
}

export interface selByRoleIdDto {
  roleId?: number;
}

export interface selListDto extends pageSelDto, insOneDto {
  id: number;
}

export interface insOneDto {
  type: string;
  roleId: number;
  permissionId: number;
  remark: string;
}

export interface insManyDto {
  roleId: number;
  permissionId: number[];
  remark: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}

export interface updManyDto extends insManyDto {
}
