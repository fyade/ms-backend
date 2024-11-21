import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CurrentUser, genCurrentUser, USER_INFO_LINSHI_FIELD_NAME } from './baseContext';

@Injectable()
export class BaseContextService {
  constructor(private readonly cls: ClsService) {
  }

  getUserData(): CurrentUser {
    const header = this.cls.get(USER_INFO_LINSHI_FIELD_NAME);
    if (header) {
      return header;
    }
    const currentUser = genCurrentUser();
    this.setUserData(currentUser);
    return currentUser;
  }

  setUserData(userData: CurrentUser) {
    this.cls.set(USER_INFO_LINSHI_FIELD_NAME, userData);
  }
}
