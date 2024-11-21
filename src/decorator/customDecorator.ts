import { SetMetadata } from '@nestjs/common';

export const PRE_AUTHORIZE_KEY = 'perAuthorize';

export class PreAuthorizeParams {
  // 权限字符
  permission: string;
  // 接口描述
  label: string;
  // 是否算法接口
  ifSF?: boolean;
  // 是否忽略权限控制
  ifIgnore?: boolean;
  // 是否在记录操作日志时不记录参数
  ifIgnoreParamInLog?: boolean;
  // 是否管理员登录接口
  ifAdminLogin?: boolean;
}

export const PreAuthorize = (param: PreAuthorizeParams) => SetMetadata(PRE_AUTHORIZE_KEY, param);

