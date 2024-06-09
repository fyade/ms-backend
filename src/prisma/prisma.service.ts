import { Injectable } from '@nestjs/common';
import { currentEnv } from '../config/config';
import { base } from '../util/base';
import { getCurrentUser } from '../util/baseContext';
import { time } from '../util/TimeUtils';
import { UnknownException } from '../exception/UnknownException';
import { pageSelDto } from '../common/dto/PageDto';
import { objToCamelCase, objToSnakeCase, toSnakeCases } from '../util/BaseUtils';

const env = currentEnv();
const { PrismaClient } = require(env.mode === base.DEV ? '@prisma/client' : '../generated/client');

@Injectable()
export class PrismaService extends PrismaClient {
  private defaultSelArg = () => {
    return {
      where: {
        deleted: base.N,
      },
    };
  };
  private defaultInsArg = () => {
    const userid = getCurrentUser().user?.userid;
    const time1 = time();
    return {
      data: {
        create_by: userid,
        update_by: userid,
        create_time: time1,
        update_time: time1,
        deleted: base.N,
      },
    };
  };
  private defaultUpdArg = () => {
    return {
      where: {
        deleted: base.N,
      },
      data: {
        update_by: getCurrentUser().user?.userid,
        update_time: time(),
      },
    };
  };
  private defaultDelArg = () => {
    return {
      where: {
        deleted: base.N,
      },
      data: {
        update_by: getCurrentUser().user?.userid,
        update_time: time(),
        deleted: base.Y,
      },
    };
  };

  constructor() {
    super({
      datasources: {
        db: {
          url: env.database.url,
        },
      },
      log: env.mode === base.DEV ? ['query', 'info', 'warn'] : [],
    });
  }

  private getModel(model: string): any {
    const modelInstance = this[model];
    if (!modelInstance) {
      throw new UnknownException();
    }
    return modelInstance;
  }

  genSelParams<T, P>({
                       data,
                       orderBy,
                       notNullKeys = [],
                       numberKeys = [],
                     }: {
    data?: P,
    orderBy?: boolean,
    notNullKeys?: string[]
    numberKeys?: string[]
  } = {}) {
    const data_ = objToSnakeCase(data);
    return {
      AND: [
        ...Object.keys(this.defaultSelArg().where).reduce((obj, item) => [
          ...obj,
          {
            [item]: this.defaultSelArg().where[item],
          },
        ], []),
        ...Object.keys(data_).reduce((obj, item) => [
          ...obj,
          {
            OR: [
              {
                [item]: toSnakeCases(numberKeys).indexOf(item) > -1 ? Number(data_[item]) : {
                  contains: `${data_[item]}`,
                },
              },
              {
                [item]: null,
              },
            ].slice(0, (toSnakeCases(notNullKeys).indexOf(item) > -1 || data_[item] !== '') ? 1 : 2),
          },
        ], []),
      ],
    };
  }

  /**
   * 查
   * @param model
   * @param data
   * @param orderBy
   * @param notNullKeys
   * @param numberKeys
   * @param ifUseGenSelParams
   */
  async findPage<T, P extends pageSelDto>(model: string, {
                                            data,
                                            orderBy,
                                            notNullKeys = [],
                                            numberKeys = [],
                                          }: {
                                            data?: P,
                                            orderBy?: boolean,
                                            notNullKeys?: string[]
                                            numberKeys?: string[]
                                          } = {}, ifUseGenSelParams = true,
  ): Promise<{
    list: T[]
    total: number
  }> {
    const pageNum = Number(data.pageNum);
    const pageSize = Number(data.pageSize);
    delete data.pageNum;
    delete data.pageSize;
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, P>({ data, orderBy, notNullKeys, numberKeys }) : {
        ...this.defaultDelArg().where,
        ...(objToSnakeCase(data) || {}),
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };
    if (orderBy) {
      arg.orderBy = {
        order_num: 'asc',
      };
    }
    const model1 = this.getModel(model);
    const list = await model1.findMany(arg);
    const list1 = list.map((item: any) => objToCamelCase(item));
    const arg2 = {
      where: arg.where,
    };
    const count = await model1.count(arg2);
    return new Promise((resolve) => {
      resolve({
        list: list1,
        total: count,
      });
    });
  }

  /**
   * 查
   * @param model
   * @param data
   * @param orderBy
   * @param notNullKeys
   * @param numberKeys
   * @param ifUseGenSelParams
   */
  async findAll<T>(model: string, {
                     data,
                     orderBy,
                     notNullKeys = [],
                     numberKeys = [],
                   }: {
                     data?: object,
                     orderBy?: boolean,
                     notNullKeys?: string[]
                     numberKeys?: string[]
                   } = {}, ifUseGenSelParams = true,
  ): Promise<T[]> {
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, object>({ data, orderBy, notNullKeys, numberKeys }) : {
        ...this.defaultDelArg().where,
        ...(objToSnakeCase(data) || {}),
      },
    };
    if (orderBy) {
      arg.orderBy = {
        order_num: 'asc',
      };
    }
    const res2 = await this.getModel(model).findMany(arg);
    const res3 = res2.map((item: any) => objToCamelCase(item));
    return new Promise(resolve => resolve(res3));
  }

  /**
   * 查
   * @param model
   * @param args
   */
  async findFirst<T>(model: string, args?: any): Promise<T> {
    const arg = {
      where: {
        ...this.defaultSelArg().where,
        ...(objToSnakeCase(args) || {}),
      },
    };
    const first = await this.getModel(model).findFirst(arg);
    const objToCamelCase1 = objToCamelCase(first);
    return new Promise(resolve => resolve(objToCamelCase1));
  }

  /**
   * 查
   * @param model
   * @param id
   */
  async findById<T>(model: string, id: any): Promise<T> {
    return this.findFirst<T>(model, { id: id });
  }

  /**
   * 查
   * @param model
   * @param ids
   */
  async findByIds<T>(model: string, ids: any[]): Promise<T[]> {
    const arg = {
      where: {
        ...this.defaultSelArg().where,
        id: {
          in: ids,
        },
      },
    };
    const list = await this.getModel(model).findMany(arg);
    const list2 = list.map((item: any) => objToCamelCase(item));
    return new Promise(resolve => resolve(list2));
  }

  /**
   * 增
   * @param model
   * @param data
   * @param ifCustomizeId
   */
  async create<T>(model: string, data: any, {
                    ifCustomizeId = false,
                  }: {
                    ifCustomizeId?: boolean
                  } = {},
  ): Promise<T> {
    if (!ifCustomizeId) {
      delete data.id;
    }
    const arg = {
      data: {
        ...this.defaultInsArg().data,
        ...(objToSnakeCase(data) || {}),
      },
    };
    return this.getModel(model).create(arg);
  }

  /**
   * 增
   * @param model
   * @param data
   * @param ifCustomizeId
   */
  async createMany<T>(model: string, data: any[], {
                        ifCustomizeId = false,
                      }: {
                        ifCustomizeId?: boolean
                      } = {},
  ): Promise<T> {
    const arg = {
      data: data.map(dat => {
        if (!ifCustomizeId) {
          delete dat.id;
        }
        return {
          ...this.defaultInsArg().data,
          ...(objToSnakeCase(dat) || {}),
        };
      }),
    };
    return this.getModel(model).createMany(arg);
  }

  /**
   * 删
   * @param model
   * @param ids
   */
  async deleteById<T>(model: string, ids: any[]): Promise<{ count: number }> {
    const arg = {
      where: {
        ...this.defaultDelArg().where,
        id: {
          in: ids,
        },
      },
      data: {
        ...this.defaultDelArg().data,
      },
    };
    return this.getModel(model).updateMany(arg);
  }

  /**
   * 删
   * @param model
   * @param key
   * @param values
   */
  async delete<T>(model: string, key: string, values: any[]): Promise<{ count: number }> {
    const arg = {
      where: {
        ...this.defaultDelArg().where,
        [key]: {
          in: values,
        },
      },
      data: {
        ...this.defaultDelArg().data,
      },
    };
    return this.getModel(model).updateMany(arg);
  }

  /**
   * 改
   * @param model
   * @param data
   */
  async updateById<T>(model: string, data?: any): Promise<T> {
    const id = data.id;
    delete data.id;
    const arg = {
      where: {
        ...this.defaultUpdArg().where,
        id: id,
      },
      data: {
        ...objToSnakeCase(data),
      },
    };
    return this.getModel(model).update(arg);
  }

  /**
   * 改
   * @param model
   * @param data
   */
  async updateMany<T>(model: string, data?: any[]): Promise<T[]> {
    const retArr: T[] = [];
    for (let i = 0; i < data.length; i++) {
      const ret = await this.updateById<T>(model, data[i]);
      retArr.push(ret);
    }
    return new Promise(resolve => resolve(retArr));
  }
}
