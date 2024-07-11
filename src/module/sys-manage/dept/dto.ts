import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class deptDto extends baseInterface {
  id: number;

  label: string;

  parentId: number;

  orderNum: number;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  label: string;

  parentId: number;

  orderNum: number;

  remark: string;
}

export class insOneDto {
  @IsNotEmpty({ message: '部门名不能为空' })
  label: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '父级部门不能为空' })
  parentId: number;

  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  remark: string;
}

export class selAllDto {
  label: string;

  parentId: number;

  orderNum: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
