/**
 * 获取类型
 * @param param
 */
export const typeOf = (param: any) => {
  if (typeof param === 'object') {
    return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
  } else {
    return typeof param;
  }
}

/**
 * sleep
 * @param ms
 */
export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
