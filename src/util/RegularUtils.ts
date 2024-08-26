/**
 * 获取数据表名
 * @param str
 */
export function getDBTableName(str: string): string {
  const regExpMatchArray = str.match(/[\u4e00-\u9fa5-]+/);
  let aaa = (regExpMatchArray && regExpMatchArray.length > 0) ? regExpMatchArray[0] : str;
  if (aaa.endsWith('表')) {
    aaa = aaa.substring(0, aaa.length - 1);
  }
  return aaa;
}
