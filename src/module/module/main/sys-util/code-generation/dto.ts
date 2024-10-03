export interface cgTablesInterface {
  rowIndex: number;
  tableNameCnInitial: string;
  tableNameEnInitial: string;
  tableNameCn: string;
  tableNameEn: string;
  cols: cgColsInterface[];
}

export interface cgColsInterface {
  colInfo: string;
  colName: string;
  colType: string;
  ifMust: boolean;
  colRemark: string;
}

