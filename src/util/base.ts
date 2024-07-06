export class baseInterface {
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
  TEST: 'test',
  PROD: 'prod',
};
