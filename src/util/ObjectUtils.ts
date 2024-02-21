/**
 * 深克隆
 * @param obj
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 数组不重复push
 * @param arr
 */
export function arrNoRepeat(arr: any[]) {
  return Array.from(new Set(arr))
}

// export function fit2Obj(obj1: object, obj2: object): object {
// }
//
// function fit2Obj_(obj0: object, obj: object): void {
// }