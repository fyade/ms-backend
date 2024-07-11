import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class userDeptDto extends baseInterface {
  id: number;

  userId: string;

  deptId: number;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  userId: string;

  deptId: number;

  remark: string;
}

export class insOneDto {
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '部门id不能为空' })
  deptId: number;

  remark: string;
}

export class selAllDto {
  userId: string;

  deptId: number;

  remark: string;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class userDeptUpdUDDto {
  userId: string;
  deptId: number[];
  remark: string;
}

export class userDeptUpdDUDto {
  userId: string[];
  deptId: number;
  remark: string;
}
