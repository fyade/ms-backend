import { Injectable } from '@nestjs/common';
import { R } from '../../../common/R';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class CodeGenerationService {
  constructor() {
  }

  async getDatabaseInfo(): Promise<R> {
    const text = fs.readFileSync(path.join(__dirname, '../../../../prisma/schema.prisma'), 'utf-8');
    const regex1 = /\/\/ .+/;
    const regex2 = /^model (\w+) {/;
    const regex3 = /^ *([\w-]+) +([\w-?]+) +([\w-@(). "']+) */;
    const lines = text.split('\n');
    const tables: any[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      if (regex1.test(lines[i]) && regex2.test(lines[i + 1])) {
        tables.push({
          rowIndex: i,
          tableNameCnInitial: lines[i],
          tableNameEnInitial: lines[i + 1],
          tableNameCn: lines[i].replace(/\/+ +/, ''),
          tableNameEn: lines[i + 1].replace(/^model +/, '').replace(/ +{/, ''),
          cols: [],
        });
      }
    }
    for (let i = 0; i < tables.length; i++) {
      const is: number = tables[i].rowIndex + 2;
      const ie: number = i === tables.length - 1 ? lines.length - 1 : tables[i + 1].rowIndex - 2;
      let is1: number = is;
      let ie1: number = ie;
      while (!regex3.test(lines[is1])) {
        is1++;
      }
      while (!regex3.test(lines[ie1])) {
        ie1--;
      }
      for (let j = is1; j <= ie1; j++) {
        tables[i].cols.push({
          colInfo: lines[j],
          colName: lines[j].replace(regex3, '$1'),
          colType: lines[j].replace(regex3, '$2').replace('?', ''),
          ifMust: !lines[j].replace(regex3, '$2').endsWith('?'),
          colRemark: lines[j].replace(regex3, '$3'),
        });
      }
    }
    return R.ok(tables);
  }
}
