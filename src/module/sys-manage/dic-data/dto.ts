import { baseInterface } from '../../../util/base';
import { pageSelDto } from '../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class dicDataDto extends baseInterface {
  id: number;

  label: string;

  value: string;

  dicType: string;

  ifDefault: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  label: string;

  value: string;

  dicType: string;

  ifDefault: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class insOneDto {
  @IsNotEmpty({ message: '标签不能为空' })
  label: string;

  @IsNotEmpty({ message: '值不能为空' })
  value: string;

  @IsNotEmpty({ message: '字典类型不能为空' })
  dicType: string;

  @IsNotEmpty({ message: '是否默认不能为空' })
  ifDefault: string;

  @IsNotEmpty({ message: '是否禁用不能为空' })
  ifDisabled: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;

  remark: string;
}

export class selAllDto {
  label: string;

  value: string;

  dicType: string;

  ifDefault: string;

  ifDisabled: string;

  orderNum: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
