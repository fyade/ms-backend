import { UserDto2 } from '../module/module/main/sys-manage/user/dto';
import { randomUUID } from './IdUtils';

const currentUser: {
  user: UserDto2
  token: string,
  reqId: string
} = {
  user: null,
  token: '',
  reqId: '',
};

export function clearCurrentUser() {
  currentUser.user = null;
  currentUser.token = '';
  currentUser.reqId = '';
}

export async function setCurrentUser(user: UserDto2, token: string) {
  currentUser.user = user;
  currentUser.token = token;
  currentUser.reqId = randomUUID();
}

export function getCurrentUser() {
  if (!currentUser.reqId) {
    currentUser.reqId = randomUUID();
  }
  return currentUser;
}
