import { UserDto2 } from '../module/main/sys-manage/user/dto';
import { randomUUID } from '../../util/IdUtils';
import { Request } from 'express';

export const USER_INFO_LINSHI_FIELD_NAME = 'user-info-linshi';

export class CurrentUser {
  user: UserDto2;
  token: string;
  reqId: string;
}

export function genCurrentUser(user?: UserDto2, token?: string) {
  const currentUser = new CurrentUser();
  currentUser.user = user;
  currentUser.token = token;
  currentUser.reqId = randomUUID();
  return currentUser;
}
