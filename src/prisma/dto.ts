// 生成的 prisma 查询参数
export class PrismaParam {
  select?: Record<string, boolean>;
  where!: {
    AND: any[];
  };
  skip!: number;
  take!: number;
  orderBy?: Record<string, string>;
}

// 查询参数的类型为 object 时的格式
export class SelectParamObj {
  in: SelectParamObjIn;

  constructor({
                in: _in = new SelectParamObjIn(),
              }: {
                in?: SelectParamObjIn
              } = {},
  ) {
    this.in = new SelectParamObjIn(_in);
  }
}

class SelectParamObjIn {
  type?: string;
  value: (string | number)[];

  constructor({
                type = 'string',
                value = [],
              }: {
                type?: string,
                value?: (string | number)[]
              } = {},
  ) {
    this.type = type;
    this.value = value;
  }
}
