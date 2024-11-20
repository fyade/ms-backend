import { HTTP } from './Enum';
import { time, timestamp as timeStamp } from '../util/TimeUtils';

export class R<T = any> {
  public code: number;
  public data: T;
  public msg: string;
  private time: Date;
  private timestamp: number;
  private reqId: string;

  constructor(code: number, data: any, msg: string) {
    this.code = code;
    this.data = data;
    this.msg = msg;
    this.time = time();
    this.timestamp = timeStamp(time());
    this.reqId = '';
  }

  static ok(data: any = true) {
    return new R(HTTP.SUCCESS().code, data, HTTP.SUCCESS().msg);
  }

  static err(msg: string) {
    return new R(HTTP.SERVER_ERROR().code, null, msg || HTTP.SERVER_ERROR().msg);
  }
}
