import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class rolePermissionDto extends baseInterface {
  id: number;

  type: string;

  roleId: number;

  permissionId: number;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  type: string;

  roleId: number;

  permissionId: number;

  remark: string;
}

export class selByRoleIdDto {
  @Type(() => Number)
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: number;
}

export class insManyDto {
  @Type(() => Number)
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: number;

  @IsArray({ message: '权限id不能为空' })
  permissionId: number[];

  @IsNotEmpty({ message: '权限类型不能为空' })
  type: string;

  remark: string;
}

export class updManyDto extends insManyDto {
}

export class insOneDto {
  type: string;

  roleId: number;

  permissionId: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  id: number;
}
