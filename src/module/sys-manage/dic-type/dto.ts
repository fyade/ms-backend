import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class dicTypeDto extends baseInterface {
  id: number;

  name: string;

  type: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  name: string;

  type: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class insOneDto {
  @IsNotEmpty({ message: '字典名不能为空' })
  name: string;

  @IsNotEmpty({ message: '字典类型不能为空' })
  type: string;

  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  remark: string;
}

export class selAllDto {
  name: string;

  type: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
