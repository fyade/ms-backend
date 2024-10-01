import { pageDto } from '../../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class userDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string;

  @ApiProperty({ description: '用户名', required: false })
  username: string;

  @ApiProperty({ description: '密码', required: false })
  password: string;

  @ApiProperty({ description: '昵称', required: false })
  nickname: string;

  @ApiProperty({ description: '头像', required: false })
  avatar: string;

  @ApiProperty({ description: '性别', required: false })
  sex: string;

  @ApiProperty({ description: '邮箱', required: false })
  email: string;

  @ApiProperty({ description: '电话', required: false })
  tel: string;
}

export class loginDto {
  @ApiProperty({ description: '用户名', required: true })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '密码类型，a:未加密/b:AES对称加密', required: true })
  @IsNotEmpty({ message: '密码类型不能为空' })
  psdType: string;
}

export class registDto extends loginDto {
}

export class updPsdDto {
  @ApiProperty({ description: '旧密码', required: true })
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldp: string;

  @ApiProperty({ description: '新密码', required: true })
  @IsNotEmpty({ message: '新密码不能为空' })
  newp1: string;

  @ApiProperty({ description: '确认新密码', required: true })
  @IsNotEmpty({ message: '确认新密码不能为空' })
  newp2: string;

  @ApiProperty({ description: '密码类型，a:未加密/b:AES对称加密', required: true })
  @IsNotEmpty({ message: '密码类型不能为空' })
  oldpType: string;

  @ApiProperty({ description: '密码类型，a:未加密/b:AES对称加密', required: true })
  @IsNotEmpty({ message: '密码类型不能为空' })
  newp1Type: string;

  @ApiProperty({ description: '密码类型，a:未加密/b:AES对称加密', required: true })
  @IsNotEmpty({ message: '密码类型不能为空' })
  newp2Type: string;
}

export class reqUser {
  userid: string;

  username: string;
}

export class userDto2 extends loginDto {
  userid: string;
}

export class userDto3 extends userDto {
  userid: string;
}

export class adminNewUserDto extends loginDto {
}

export class userListSelDto extends pageDto {
  @ApiProperty({ description: '用户id', required: false })
  id: string;

  @ApiProperty({ description: '查询是否带权限', required: false })
  ifWithRole: string;

  @ApiProperty({ description: '用户名', required: false })
  username: string;

  @ApiProperty({ description: '昵称', required: false })
  nickname: string;

  @ApiProperty({ description: '性别', required: false })
  sex: string;
}

export class resetPsdDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '密码类型，a:未加密/b:AES对称加密', required: true })
  @IsNotEmpty({ message: '密码类型不能为空' })
  psdType: string;
}
