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
};

/**
 * sleep
 * @param ms
 */
export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 下划线转驼峰
 * @param str
 */
export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (all, i) => i.toLowerCase());
}

type ObjectType = Record<string, any>;

/**
 * 对象的key下划线命名转驼峰命名
 * @param obj
 */
export function objToCamelCase<T extends ObjectType>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  const newObj = Array.isArray(obj) ? [] : {} as any;
  for (const key in obj) {
    const newKey = key.replace(/_([a-z])/g, (match, char) => char.toUpperCase()) as keyof any;
    newObj[newKey] = objToCamelCase(obj[key]);
  }
  return newObj as T;
}

/**
 * 对象的key驼峰命名转下划线命名
 * @param obj
 */
export function objToSnakeCase<T extends ObjectType>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  const newObj = Array.isArray(obj) ? [] : {} as unknown as T;
  for (const key in obj) {
    const newKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() as keyof any;
    newObj[newKey] = objToSnakeCase(obj[key]) as T[keyof T];
  }
  return newObj as T;
}
