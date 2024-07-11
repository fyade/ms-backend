import { pageSelDto } from '../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';

export class userDto {
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string;

  username: string;

  password: string;

  nickname: string;

  avatar: string;

  sex: string;

  email: string;

  tel: string;
}

export class loginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class updPsdDto {
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldp: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  newp1: string;

  @IsNotEmpty({ message: '确认新密码不能为空' })
  newp2: string;
}

export class reqUser {
  userid: string;

  username: string;
}

export class userDto2 extends loginDto {
  userid: string;
}

export class adminNewUserDto extends loginDto {
}

export class registDto extends loginDto {
}

export class userListSelDto extends pageSelDto {
  id: string;

  ifWithRole: string;

  username: string;

  nickname: string;

  sex: string;
}

export class resetPsdDto {
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
