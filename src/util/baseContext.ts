import { UserDto2 } from '../module/module/main/sys-manage/user/dto';

const currentUser: {
  user: UserDto2
  token: string
} = {
  user: null,
  token: '',
};

export function clearCurrentUser() {
  currentUser.user = null;
  currentUser.token = '';
}

export async function setCurrentUser(user: UserDto2, token: string) {
  currentUser.user = user;
  currentUser.token = token;
}

export function getCurrentUser() {
  return currentUser;
}