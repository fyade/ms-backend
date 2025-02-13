import { timestamp } from './TimeUtils';

const { v4: uuidv4 } = require('uuid');

/**
 * 生成uuid
 */
export function randomUUID(): string {
  return uuidv4();
}

const strArr = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
];
const idsOfLengthStr: string[] = [];

/**
 * 生成id
 * @param length
 * @param suffix
 */
export function genId(length = 16, suffix = true): string {
  if (idsOfLengthStr.length >= Math.pow(strArr.length, length)) {
    throw new Error('数量过多，无法计算。');
  }

  /**
   * 返回length位字符串，且不会跟之前返回过的重复（新方法
   * @returns {string}
   */
  function generateLengthStr() {
    let str: string = '';
    while (!!!str || idsOfLengthStr.includes(str)) {
      str = '';
      for (let i = 0; i < length; i++) {
        str += strArr[Math.floor(Math.random() * strArr.length)];
      }
    }
    idsOfLengthStr.push(str);
    return str;
  }

  return suffix ? `${generateLengthStr()}_${timestamp()}` : generateLengthStr();
}
