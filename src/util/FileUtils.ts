const fs = require('fs').promises;
const path = require('path');

/**
 * 获取某文件夹下的所有文件（包括子文件夹）
 * @param directoryPath
 */
export async function getAllFiles(directoryPath: string) {
  const ret: string[] = [];
  await _(directoryPath);
  return ret;

  async function _(directoryPath: string) {
    const files: string[] = await fs.readdir(directoryPath);
    if (files.length > 0) {
      for (const path of files) {
        if (path.includes('.')) {
          ret.push(`${directoryPath}/${path}`);
        } else {
          await _(`${directoryPath}/${path}`);
        }
      }
    }
  }
}
