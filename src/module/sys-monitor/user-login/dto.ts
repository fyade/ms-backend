import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { Expose, Transform, Type } from 'class-transformer';

export class insOneDto {
  userId: string;
  loginIp?: string;
  loginPosition?: string;
  loginBrowser?: string;
  loginOs?: string;
  ifSuccess: string;
  remark?: string;
}

export interface userLoginDto extends insOneDto, baseInterface {
  id: number;
}

export class selListDto extends pageSelDto {
  id: number;
  userId: string;
  loginIp?: string;
  loginPosition?: string;
  loginBrowser?: string;
  loginOs?: string;
  ifSuccess: string;
  remark?: string;
  createTime?: Date;
}

export class selAllDto {
  userId: string;
  loginIp?: string;
  loginPosition?: string;
  loginBrowser?: string;
  loginOs?: string;
  ifSuccess?: string;
  remark?: string;
}

export interface updOneDto extends insOneDto {
  id: number;
}
