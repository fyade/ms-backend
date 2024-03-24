export interface baseInterface {
  create_by: string;
  update_by: string;
  create_time: Date;
  update_time: Date;
  deleted: string;
}

export const base = {
  Y: 'Y',
  N: 'N',
  DEV: 'dev',
};
