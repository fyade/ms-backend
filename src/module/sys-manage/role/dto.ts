import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class roleDto extends baseInterface {
  id: number;

  label: string;

  ifAdmin: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  label: string;

  ifAdmin: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class selAllDto {
  id: number;
}

export class insOneDto {
  @IsNotEmpty({ message: '角色名不能为空' })
  label: string;

  @IsNotEmpty({ message: '是否管理员用户不能为空' })
  ifAdmin: string;

  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
