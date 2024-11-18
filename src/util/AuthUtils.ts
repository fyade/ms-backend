import { UserDto, UserDto3 } from '../module/module/main/sys-manage/user/dto';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../../config/config';

export function generateToken(user: UserDto) {
  const payload = { username: user.username, userid: user.id || (user as UserDto3).userid };
  return jwt.sign(payload, jwtConstants.secret, {
    expiresIn: jwtConstants.expireTime,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtConstants.secret);
}
