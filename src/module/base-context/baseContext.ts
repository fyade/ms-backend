import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserDto2 } from '../module/main/sys-manage/user/dto';
import { randomUUID } from '../../util/IdUtils';
import { Request } from 'express';

export const REQUEST_SCOPE = 'request';

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

export function getReqIdFromReqHeader(request: Request) {
  try {
    return JSON.parse(request.headers[USER_INFO_LINSHI_FIELD_NAME] as string)?.reqId;
  } catch (e) {
    return 'no code';
  }
}

export function createRequestScope(): Provider {
  return {
    provide: REQUEST_SCOPE,
    scope: Scope.REQUEST,
    useFactory: (req) => ({
      getRequest() {
        return req;
      },
    }),
    inject: [REQUEST],
  };
}
