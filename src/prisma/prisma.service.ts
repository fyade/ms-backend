import { Injectable } from '@nestjs/common';
import { currentEnv, getMysqlUrlFromEnv } from '../../config/config';
import { base } from '../util/base';
import { getCurrentUser } from '../util/baseContext';
import { time } from '../util/TimeUtils';
import { UnknownException } from '../exception/UnknownException';
import { pageDto } from '../common/dto/PageDto';
import { objToCamelCase, objToSnakeCase, toCamelCase, toSnakeCase, toSnakeCases, typeOf } from '../util/BaseUtils';

const env = currentEnv();
const { PrismaClient } = require(env.mode === base.DEV ? '@prisma/client' : '../generated/client');

@Injectable()
export class PrismaService extends PrismaClient {
  private defaultSelArg = ({
                             ifDeleted = true,
                           }: {
                             ifDeleted?: boolean
                           } = {},
  ) => {
    const retObj = {
      where: {
        deleted: base.N,
      },
    };
    if (!ifDeleted) delete retObj.where.deleted;
    return retObj;
  };
  private defaultInsArg = ({
                             ifCreateBy = true,
                             ifUpdateBy = true,
                             ifCreateTime = true,
                             ifUpdateTime = true,
                             ifDeleted = true,
                           }: {
                             ifCreateBy?: boolean,
                             ifUpdateBy?: boolean,
                             ifCreateTime?: boolean,
                             ifUpdateTime?: boolean,
                             ifDeleted?: boolean,
                           } = {},
  ) => {
    const userid = getCurrentUser().user?.userid;
    const time1 = time();
    const retObj = {
      data: {
        create_by: userid,
        update_by: userid,
        create_time: time1,
        update_time: time1,
        deleted: base.N,
      },
    };
    if (!ifCreateBy) delete retObj.data.create_by;
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifCreateTime) delete retObj.data.create_time;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.data.deleted;
    return retObj;
  };
  private defaultUpdArg = ({
                             ifUpdateBy = true,
                             ifUpdateTime = true,
                             ifDeleted = true,
                           }: {
                             ifUpdateBy?: boolean,
                             ifUpdateTime?: boolean,
                             ifDeleted?: boolean,
                           } = {},
  ) => {
    const retObj = {
      where: {
        deleted: base.N,
      },
      data: {
        update_by: getCurrentUser().user?.userid,
        update_time: time(),
      },
    };
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.where.deleted;
    return retObj;
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
          url: getMysqlUrlFromEnv(env),
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
                       range = {},
                       notNullKeys = [],
                       numberKeys = [],
                       completeMatchingKeys = [],
                       ifDeleted = true,
                     }: {
                       data?: P,
                       orderBy?: boolean | object,
                       range?: object,
                       notNullKeys?: string[]
                       numberKeys?: string[]
                       completeMatchingKeys?: string[]
                       ifDeleted?: boolean
                     } = {},
  ) {
    const data_ = objToSnakeCase(data);
    const publicData = this.defaultSelArg({ ifDeleted }).where;
    return {
      AND: [
        ...Object.keys(publicData).reduce((obj, item) => [
          ...obj,
          {
            [item]: publicData[item],
          },
        ], []),
        ...Object.keys(data_).reduce((obj, item) => {
          let datum = '';
          try {
            datum = JSON.parse(data_[item]);
          } catch (e) {
            datum = data_[item];
          }
          return [
            ...obj,
            {
              OR: [
                {
                  [item]: typeOf(datum) === 'object'
                    ? Object.keys(datum).reduce((obj, itm) => ({
                      ...obj,
                      [itm]: datum[itm].type === 'number'
                        ? typeOf(datum[itm].value) === 'array'
                          ? datum[itm].value.map(item => Number(item))
                          : typeOf(datum[itm].value) === 'object'
                            ? Object.keys(datum[itm].value).reduce((obj, key) => ({
                              ...obj,
                              [key]: Number(datum[itm].value[key]),
                            }), {})
                            : typeOf(datum[itm].value) === 'string'
                              ? Number(datum[itm].value)
                              : datum[itm].value
                        : datum[itm].value,
                    }), {})
                    : toSnakeCases(numberKeys).indexOf(item) > -1
                      ? Number(datum)
                      : toSnakeCases(completeMatchingKeys).indexOf(item) > -1
                        ? datum
                        : {
                          contains: `${datum}`,
                        },
                },
                {
                  [item]: null,
                },
              ].slice(0, (toSnakeCases(notNullKeys).indexOf(item) > -1 || datum !== '') ? 1 : 2),
            },
          ];
        }, []),
        ...Object.keys(range).map(item => (
          {
            [toSnakeCase(item)]: {
              gte: range[item].gte,
              lte: range[item].lte,
            },
          }
        )),
      ],
    };
  }

  /**
   * 分页查询
   * @param model
   * @param data
   * @param orderBy
   * @param range
   * @param notNullKeys
   * @param numberKeys
   * @param completeMatchingKeys
   * @param ifDeleted
   * @param ifUseGenSelParams
   */
  async findPage<T, P extends pageDto>(model: string, {
                                         data,
                                         orderBy,
                                         range = {},
                                         notNullKeys = [],
                                         numberKeys = [],
                                         completeMatchingKeys = [],
                                         ifDeleted = true,
                                       }: {
                                         data?: P,
                                         orderBy?: boolean | object,
                                         range?: object,
                                         notNullKeys?: string[]
                                         numberKeys?: string[],
                                         completeMatchingKeys?: string[],
                                         ifDeleted?: boolean,
                                       } = {}, ifUseGenSelParams = true,
  ): Promise<{
    list: T[]
    total: number
  }> {
    const pageNum = Number(data.pageNum);
    const pageSize = Number(data.pageSize);
    delete data.pageNum;
    delete data.pageSize;
    const publicData = this.defaultSelArg({ ifDeleted }).where;
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, P>({
        data,
        orderBy,
        range,
        notNullKeys,
        numberKeys,
        completeMatchingKeys,
        ifDeleted,
      }) : {
        ...publicData,
        ...(objToSnakeCase(data) || {}),
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };
    if (typeof orderBy === 'boolean' && orderBy) {
      arg.orderBy = {
        order_num: 'asc',
      };
    } else if (orderBy) {
      arg.orderBy = {
        [toSnakeCase(Object.keys(orderBy)[0])]: Object.values(orderBy)[0],
      };
    } else {
      arg.orderBy = {
        create_time: 'desc',
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
   * 查询所有
   * @param model
   * @param data
   * @param orderBy
   * @param range
   * @param notNullKeys
   * @param numberKeys
   * @param completeMatchingKeys
   * @param ifDeleted
   * @param ifUseGenSelParams
   */
  async findAll<T>(model: string, {
                     data,
                     orderBy,
                     range = {},
                     notNullKeys = [],
                     numberKeys = [],
                     completeMatchingKeys = [],
                     ifDeleted = true,
                   }: {
                     data?: object,
                     orderBy?: boolean | object,
                     range?: object,
                     notNullKeys?: string[]
                     numberKeys?: string[]
                     completeMatchingKeys?: string[]
                     ifDeleted?: boolean,
                   } = {}, ifUseGenSelParams = true,
  ): Promise<T[]> {
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, object>({
        data,
        orderBy,
        range,
        notNullKeys,
        numberKeys,
        completeMatchingKeys,
        ifDeleted,
      }) : {
        ...this.defaultSelArg({ ifDeleted }).where,
        ...(objToSnakeCase(data) || {}),
      },
    };
    if (typeof orderBy === 'boolean' && orderBy) {
      arg.orderBy = {
        order_num: 'asc',
      };
    } else if (orderBy) {
      arg.orderBy = {
        [toSnakeCase(Object.keys(orderBy)[0])]: Object.values(orderBy)[0],
      };
    } else {
      arg.orderBy = {
        create_time: 'desc',
      };
    }
    const res2 = await this.getModel(model).findMany(arg);
    const res3 = res2.map((item: any) => objToCamelCase(item));
    return new Promise(resolve => resolve(res3));
  }

  /**
   * 查询首个
   * @param model
   * @param args
   * @param ifDeleted
   */
  async findFirst<T>(model: string, args?: any, {
                       ifDeleted = true,
                     }: {
                       ifDeleted?: boolean
                     } = {},
  ): Promise<T> {
    const arg = {
      where: {
        ...this.defaultSelArg({ ifDeleted }).where,
        ...(objToSnakeCase(args) || {}),
      },
    };
    const first = await this.getModel(model).findFirst(arg);
    const objToCamelCase1 = objToCamelCase(first);
    return new Promise(resolve => resolve(objToCamelCase1));
  }

  /**
   * 查询单个
   * @param model
   * @param id
   * @param ifDeleted
   */
  async findById<T>(model: string, id: number | string, {
                      ifDeleted = true,
                    }: {
                      ifDeleted?: boolean
                    } = {},
  ): Promise<T> {
    return this.findFirst<T>(model, { id: id }, { ifDeleted });
  }

  /**
   * 查询多个（根据id）
   * @param model
   * @param ids
   * @param ifDeleted
   */
  async findByIds<T>(model: string, ids: number[] | string[], {
                       ifDeleted = true,
                     }: {
                       ifDeleted?: boolean
                     } = {},
  ): Promise<T[]> {
    const arg = {
      where: {
        ...this.defaultSelArg({ ifDeleted }).where,
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
   * 数量
   * @param model
   * @param data
   * @param range
   * @param notNullKeys
   * @param numberKeys
   * @param completeMatchingKeys
   * @param ifDeleted
   * @param ifUseGenSelParams
   */
  async count<T>(model: string, {
                   data,
                   range = {},
                   notNullKeys = [],
                   numberKeys = [],
                   completeMatchingKeys = [],
                   ifDeleted = true,
                 }: {
                   data?: object,
                   range?: object,
                   notNullKeys?: string[]
                   numberKeys?: string[]
                   completeMatchingKeys?: string[]
                   ifDeleted?: boolean,
                 } = {}, ifUseGenSelParams = true,
  ): Promise<number> {
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, object>({
        data,
        range,
        notNullKeys,
        numberKeys,
        completeMatchingKeys,
        ifDeleted,
      }) : {
        ...this.defaultSelArg({ ifDeleted }).where,
        ...(objToSnakeCase(data) || {}),
      },
    };
    const count = await this.getModel(model).count(arg);
    return new Promise(resolve => resolve(count));
  }

  /**
   * 新增
   * @param model
   * @param data
   * @param ifCustomizeId
   * @param ifCreateBy
   * @param ifUpdateBy
   * @param ifCreateTime
   * @param ifUpdateTime
   * @param ifDeleted
   */
  async create<T>(model: string, data: any, {
                    ifCustomizeId = false,
                    ifCreateBy = true,
                    ifUpdateBy = true,
                    ifCreateTime = true,
                    ifUpdateTime = true,
                    ifDeleted = true,
                  }: {
                    ifCustomizeId?: boolean,
                    ifCreateBy?: boolean,
                    ifUpdateBy?: boolean,
                    ifCreateTime?: boolean,
                    ifUpdateTime?: boolean,
                    ifDeleted?: boolean,
                  } = {},
  ): Promise<T> {
    if (!ifCustomizeId) {
      delete data.id;
    }
    const publicData = this.defaultInsArg({ ifCreateBy, ifUpdateBy, ifCreateTime, ifUpdateTime, ifDeleted }).data;
    const arg = {
      data: {
        ...publicData,
        ...(objToSnakeCase(data) || {}),
      },
    };
    const retData = await this.getModel(model).create(arg);
    return new Promise(resolve => resolve(objToCamelCase(retData)));
  }

  /**
   * 批量新增
   * @param model
   * @param data
   * @param ifCustomizeId
   * @param ifCreateBy
   * @param ifUpdateBy
   * @param ifCreateTime
   * @param ifUpdateTime
   * @param ifDeleted
   */
  async createMany<T>(model: string, data: any[], {
                        ifCustomizeId = false,
                        ifCreateBy = true,
                        ifUpdateBy = true,
                        ifCreateTime = true,
                        ifUpdateTime = true,
                        ifDeleted = true,
                      }: {
                        ifCustomizeId?: boolean,
                        ifCreateBy?: boolean,
                        ifUpdateBy?: boolean,
                        ifCreateTime?: boolean,
                        ifUpdateTime?: boolean,
                        ifDeleted?: boolean,
                      } = {},
  ): Promise<T> {
    const publicData = this.defaultInsArg({ ifCreateBy, ifUpdateBy, ifCreateTime, ifUpdateTime, ifDeleted }).data;
    const arg = {
      data: data.map(dat => {
        if (!ifCustomizeId) {
          delete dat.id;
        }
        return {
          ...publicData,
          ...(objToSnakeCase(dat) || {}),
        };
      }),
    };
    const retData = await this.getModel(model).createMany(arg);
    return new Promise(resolve => resolve(retData));
  }

  /**
   * 修改
   * @param model
   * @param data
   * @param ifUpdateBy
   * @param ifUpdateTime
   * @param ifDeleted
   */
  async updateById<T>(model: string, data?: any, {
                        ifUpdateBy = true,
                        ifUpdateTime = true,
                        ifDeleted = true,
                      }: {
                        ifUpdateBy?: boolean,
                        ifUpdateTime?: boolean,
                        ifDeleted?: boolean,
                      } = {},
  ): Promise<T> {
    const id = data.id;
    delete data.id;
    const arg = {
      where: {
        ...this.defaultUpdArg({ ifUpdateBy, ifUpdateTime, ifDeleted }).where,
        id: id,
      },
      data: {
        ...objToSnakeCase(data),
      },
    };
    const retData = await this.getModel(model).update(arg);
    return new Promise(resolve => resolve(objToCamelCase(retData)));
  }

  /**
   * 批量修改
   * @param model
   * @param data
   * @param ifUpdateBy
   * @param ifUpdateTime
   * @param ifDeleted
   */
  async updateMany<T>(model: string, data?: any[], {
                        ifUpdateBy = true,
                        ifUpdateTime = true,
                        ifDeleted = true,
                      }: {
                        ifUpdateBy?: boolean,
                        ifUpdateTime?: boolean,
                        ifDeleted?: boolean,
                      } = {},
  ): Promise<T[]> {
    const retArr: T[] = [];
    for (let i = 0; i < data.length; i++) {
      const ret = await this.updateById<T>(model, data[i], { ifUpdateBy, ifUpdateTime, ifDeleted });
      retArr.push(ret);
    }
    return new Promise(resolve => resolve(retArr));
  }

  /**
   * 批量删除
   * @param model
   * @param ids
   */
  async deleteById<T>(model: string, ids: number[] | string[]): Promise<{ count: number }> {
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
   * 条件删除
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
}
