export class pageVo<T = any> {
  pageNum: number;
  pageSize: number;
  total: number;
  list: T[];
  ifFirst: boolean;
  ifLast: boolean;
}