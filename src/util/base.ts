export interface baseInterface {
  createBy: string;
  updateBy: string;
  createTime: Date;
  updateTime: Date;
  deleted: string;
}

export const base = {
  Y: 'Y',
  N: 'N',
  DEV: 'dev',
};
