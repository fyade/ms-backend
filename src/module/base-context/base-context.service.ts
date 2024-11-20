import { Inject, Injectable, Scope } from '@nestjs/common';
import { CurrentUser, genCurrentUser, REQUEST_SCOPE, USER_INFO_LINSHI_FIELD_NAME } from './baseContext';
import { Request } from 'express';

@Injectable({
  scope: Scope.REQUEST,
})
export class BaseContextService {
  constructor(@Inject(REQUEST_SCOPE) private requestScope) {
  }

  getUserData(): CurrentUser {
    const header = this.requestScope.getRequest().headers[USER_INFO_LINSHI_FIELD_NAME];
    if (header) {
      return JSON.parse(header);
    }
    const currentUser = genCurrentUser();
    this.setUserData(currentUser);
    return currentUser;
  }

  setUserData(userData: CurrentUser) {
    this.requestScope.getRequest().headers[USER_INFO_LINSHI_FIELD_NAME] = JSON.stringify(userData);
  }
}
