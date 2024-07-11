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

export class selAllDto {
  userId: string;

  roleId: number;

  remark: string;
}

export class insOneDto {
  userId: string;

  roleId: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  id: number;
}

export class updManyURDto {
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: string;

  @IsArray({ message: '角色id应为数组' })
  roleId: number[];

  remark: string;
}

export class updManyRUDto {
  @IsArray({ message: '用户id应为数组' })
  userId: string[];

  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: number;

  remark: string;
}
