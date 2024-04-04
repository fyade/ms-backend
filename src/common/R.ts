import { HTTP } from './Enum';

export class R {
  public code: number;
  public data: any;
  public msg: string;
  private time: Date;
  private timestamp: number;

  constructor(code: number, data: any, msg: string) {
    this.code = code;
    this.data = data;
    this.msg = msg;
    this.time = new Date();
    this.timestamp = this.time.getTime();
  }

  static ok(data?: any) {
    return new R(HTTP.SUCCESS().code, data, HTTP.SUCCESS().msg);
  }

  static err(msg: string) {
    return new R(HTTP.SERVER_ERROR().code, null, msg || HTTP.SERVER_ERROR().msg);
  }
}

export interface RType {
  code: number;
  data: any;
  msg: string;
}
