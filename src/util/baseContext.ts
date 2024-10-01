import { userDto2 } from '../module/main/sys-manage/user/dto';

const currentUser: {
  user: userDto2
  token: string
} = {
  user: null,
  token: '',
};

export function clearCurrentUser() {
  currentUser.user = null;
  currentUser.token = '';
}

export async function setCurrentUser(user: userDto2, token: string) {
  currentUser.user = user;
  currentUser.token = token;
}

export function getCurrentUser() {
  return currentUser;
}