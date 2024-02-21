const moment = require('moment');
import 'moment-timezone';

/**
 * 时间差
 * @param time1
 * @param time2
 */
export function timeDiff(time1: Date, time2: Date) {
  return time2.getTime() - time1.getTime()
}

export function time() {
  return moment().tz("Asia/Shanghai").format()
}

export function utcTime() {
  return moment().utc().format()
}

export function timestamp() {
  return new Date().getTime()
}