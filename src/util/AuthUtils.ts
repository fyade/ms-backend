import { userDto } from '../module/sys-manage/user/dto';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../../config/authConfig';

export function generateToken(user: userDto) {
  const payload = { username: user.username, userid: user.id || (user as any).userid };
  return jwt.sign(payload, jwtConstants.secret, {
    expiresIn: jwtConstants.expireTime,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtConstants.secret);
}
