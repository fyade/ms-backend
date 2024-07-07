import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class menuDto extends baseInterface {
  id: number;

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

export class selAllDto {
  id: number;

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

export class insOneDto {
  @IsNotEmpty({ message: '菜单/组件名不能为空' })
  label: string;

  @IsNotEmpty({ message: '菜单类型不能为空' })
  type: string;

  @IsNotEmpty({ message: '菜单路径不能为空' })
  path: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '父级菜单不能为空' })
  parentId: number;

  @IsNotEmpty({ message: '组件路径不能为空' })
  component: string;

  icon: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  @IsNotEmpty({ message: '是否外链不能为空' })
  ifLink: string;

  @IsNotEmpty({ message: '是否显示不能为空' })
  ifVisible: string;

  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @IsNotEmpty({ message: '是否公共接口不能为空' })
  ifPublic: string;

  @IsNotEmpty({ message: '权限标识不能为空' })
  perms: string;

  remark: string;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
