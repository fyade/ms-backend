import { pageSelDto } from '../../../common/dto/PageDto';

export interface reqUser {
  userid: string;
  username: string;
}

export interface userDto extends loginDto {
  id: string;
}

export interface userDto2 extends loginDto {
  userid: string;
}

export interface loginDto {
  username: string;
  password: string;
}

export interface registDto extends loginDto {
}

export interface userListSelDto extends pageSelDto {
}

export interface resetPsdDto {
  id: string;
  password: string;
}
