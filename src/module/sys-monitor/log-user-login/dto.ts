import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';

export class userLoginDto extends baseInterface {
  id: number;

  userId: string;

  loginIp: string;

  loginPosition: string;

  loginBrowser: string;

  loginOs: string;

  ifSuccess: string;

  remark: string;
}

export class selListDto extends pageSelDto {
  id: number;

  userId: string;

  loginIp: string;

  loginPosition: string;

  loginBrowser: string;

  loginOs: string;

  ifSuccess: string;

  remark: string;

  createTime: Date;
}

export class selAllDto {
  userId?: string;

  loginIp?: string;

  loginPosition?: string;

  loginBrowser?: string;

  loginOs?: string;

  ifSuccess?: string;

  remark?: string;
}

export class insOneDto {
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: string;

  loginIp: string;

  loginPosition: string;

  loginBrowser: string;

  loginOs: string;

  @IsNotEmpty({ message: '是否成功不能为空' })
  ifSuccess: string;

  remark: string;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}
