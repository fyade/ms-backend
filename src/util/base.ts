export const T_MENU = 'mm'
export const T_COMP = 'mc'
export const T_IS = 'ma'
export const T_Inter = 'mb'
export type T_MENU = 'mm'
export type T_COMP = 'mc'
export type T_IS = 'ma'
export type T_Inter = 'mb'
export type TMenuType = T_MENU | T_COMP | T_IS | T_Inter
export const menuTypeDict = {
  [T_MENU]: '菜单',
  [T_COMP]: '组件',
  [T_IS]: '接口组',
  [T_Inter]: '接口',
};

export const T_IP = 'ip'
export const T_HOST = 'ho'
export type T_IP = 'ip'
export type T_HOST = 'ho'
export type TMIWLType = T_IP | T_HOST

export const base = {
  Y: 'Y',
  N: 'N',
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod',
};

export const publicDict = {
  id: '主键id',
  remark: '备注',
  orderNum: '顺序',
  ifDefault: '是否默认',
  ifDisabled: '是否禁用',
  createBy: 'createBy',
  updateBy: 'updateBy',
  createTime: 'createTime',
  updateTime: 'updateTime',
  deleted: '逻辑删除',
};
