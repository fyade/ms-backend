import { randomUUID } from '../../util/IdUtils';

export const USER_INFO_LINSHI_FIELD_NAME = 'user-info-linshi';

export class CurrentUser {
  userId: string;
  token: string;
  reqId: string;
  loginRole: string;
}

export function genCurrentUser(user?: string, token?: string, loginRole?: string) {
  const currentUser = new CurrentUser();
  currentUser.userId = user;
  currentUser.token = token;
  currentUser.reqId = randomUUID();
  currentUser.loginRole = loginRole;
  return currentUser;
}
