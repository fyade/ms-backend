import { pageSelDto } from '../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';


export class loginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}


export interface reqUser {
  userid: string;
  username: string;
}

export interface userDto extends loginDtoi {
  id: string;
}

export interface userDto2 extends loginDtoi {
  userid: string;
}

export interface adminNewUserDto {
  username: string;
  password: string;
}

export interface loginDtoi {
  username: string;
  password: string;
}

export interface registDto extends loginDtoi {
}

export interface userListSelDto extends pageSelDto {
  ifWithRole: string;
  username: string;
  nickname: string;
  sex: string;
}

export interface resetPsdDto {
  id: string;
  password: string;
}
