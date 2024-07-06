import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsArray, IsNotEmpty } from 'class-validator';

export class userRoleDto extends baseInterface {
  id: number;

  userId: string;

  roleId: number;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  userId: string;

  roleId: number;

  remark: string;
}

export class insManyDto {
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: string;

  @IsArray({ message: '角色id应为数组' })
  roleId: number[];

  remark: string;
}

export class updManyDto extends insManyDto {
}

export class insOneDto {
  userId: string;

  roleId: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  id: number;
}
