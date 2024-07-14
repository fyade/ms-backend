/**
 * 获取数据表名
 * @param str
 */
export function getDBTableName(str: string): string {
  let aaa = str.match(/[\u4e00-\u9fa5-]+/)[0];
  if (aaa.endsWith('表')) {
    aaa = aaa.substring(0, aaa.length - 1);
  }
  return aaa;
}
