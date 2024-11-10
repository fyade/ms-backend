import { Injectable } from '@nestjs/common';
import { currentEnv, getMysqlUrlFromEnv } from '../../config/config';
import { base } from '../util/base';
import { getCurrentUser } from '../util/baseContext';
import { time } from '../util/TimeUtils';
import { UnknownException } from '../exception/UnknownException';
import { PageDto } from '../common/dto/PageDto';
import { objToCamelCase, objToSnakeCase, toCamelCase, toSnakeCase, toSnakeCases, typeOf } from '../util/BaseUtils';
import { PageVo } from '../common/vo/PageVo';
import { deepClone } from '../util/ObjectUtils';

const env = currentEnv();
const { PrismaClient } = require(env.mode === base.DEV ? '@prisma/client' : '../../generated/client');

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: getMysqlUrlFromEnv(env),
        },
      },
      log: env.mode === base.DEV ? ['query', 'info', 'warn'] : [],
    });
    // 使用中间件对查询结果中的Bigint类型进行序列化
    super.$use(async (params, next) => {
      const t1 = Date.now();
      const result = await next(params);
      const t2 = Date.now();
      if ([base.DEV, base.TEST].includes(currentEnv().mode)) {
        console.info(`Query ${params.model}.${params.action} took ${t2 - t1}ms`);
      }
      return this.serialize(result);
    });
  }

  private serialize(obj) {
    if (typeOf(obj) === 'bigint') {
      return parseInt(`${obj}`);
    } else if (typeOf(obj) === 'object') {
      return JSON.parse(
        JSON.stringify(obj, (key, value) => {
          if (typeOf(value) === 'bigint') {
            return parseInt(`${value}`);
          }
          return value;
        }),
      );
    } else if (typeOf(obj) === 'array') {
      return obj.map(item => {
        return this.serialize(item);
      });
    }
    return obj;
  }

  private defaultSelArg = ({
                             ifDeleted = true,
                             ifDataSegregation = false,
                           }: {
                             ifDeleted?: boolean
                             ifDataSegregation?: boolean
                           } = {},
  ) => {
    const retObj = {
      where: {
        create_by: getCurrentUser().user?.userid,
        deleted: base.N,
      },
    };
    if (!ifDeleted) delete retObj.where.deleted;
    if (!ifDataSegregation) delete retObj.where.create_by;
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
                             ifDataSegregation = false,
                           }: {
                             ifUpdateBy?: boolean,
                             ifUpdateTime?: boolean,
                             ifDeleted?: boolean,
                             ifDataSegregation?: boolean,
                           } = {},
  ) => {
    const retObj = {
      where: {
        create_by: getCurrentUser().user?.userid,
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
    if (!ifDataSegregation) delete retObj.where.create_by;
    return retObj;
  };
  private defaultDelArg = ({
                             ifDataSegregation = false,
                           }: {
                             ifDataSegregation?: boolean
                           } = {},
  ) => {
    const retObj = {
      where: {
        create_by: getCurrentUser().user?.userid,
        deleted: base.N,
      },
      data: {
        update_by: getCurrentUser().user?.userid,
        update_time: time(),
        deleted: base.Y,
      },
    };
    if (!ifDataSegregation) delete retObj.where.create_by;
    return retObj;
  };

  private getModel(model: string): any {
    const modelInstance = this[model];
    if (!modelInstance) {
      throw new UnknownException();
    }
    return modelInstance;
  }

  private genSelParams<T, P>({
                               data,
                               orderBy,
                               range = {},
                               notNullKeys = [],
                               numberKeys = [],
                               completeMatchingKeys = [],
                               ifDeleted = true,
                               ifDataSegregation = false,
                             }: {
                               data?: P,
                               orderBy?: boolean | object,
                               range?: object,
                               notNullKeys?: string[]
                               numberKeys?: string[]
                               completeMatchingKeys?: string[]
                               ifDeleted?: boolean
                               ifDataSegregation?: boolean
                             } = {},
  ) {
    const data_ = objToSnakeCase(data);
    const publicData = this.defaultSelArg({ ifDeleted, ifDataSegregation }).where;
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
          const ret = [
            ...obj,
            {
              OR: [
                {
                  [item]: typeOf(datum) === 'object'
                    ? Object.keys(datum).reduce((obj, itm) => {
                      return {
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
                      };
                    }, {})
                    : toSnakeCases(numberKeys).includes(item)
                      ? Number(datum)
                      : (toSnakeCases(completeMatchingKeys).includes(item) && !!datum)
                        ? datum
                        : {
                          contains: `${datum}`,
                        },
                },
                {
                  [item]: null,
                },
              ].slice(0, (toSnakeCases(notNullKeys).includes(item) || datum !== '') ? 1 : 2),
            },
          ];
          return ret;
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
   * @param ifDataSegregation
   * @param ifUseGenSelParams
   */
  async findPage<T, P extends PageDto>(model: string, {
                                         data,
                                         orderBy,
                                         range = {},
                                         notNullKeys = [],
                                         numberKeys = [],
                                         completeMatchingKeys = [],
                                         ifDeleted = true,
                                         ifDataSegregation = false,
                                       }: {
                                         data?: P,
                                         orderBy?: boolean | object,
                                         range?: object,
                                         notNullKeys?: string[]
                                         numberKeys?: string[],
                                         completeMatchingKeys?: string[],
                                         ifDeleted?: boolean,
                                         ifDataSegregation?: boolean,
                                       } = {},
                                       ifUseGenSelParams = true,
  ): Promise<PageVo<T>> {
    const pageNum = Number(data.pageNum);
    const pageSize = Number(data.pageSize);
    const data2 = deepClone(data);
    delete data2.pageNum;
    delete data2.pageSize;
    const publicData = this.defaultSelArg({ ifDeleted, ifDataSegregation }).where;
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, P>({
        data: data2,
        orderBy,
        range,
        notNullKeys,
        numberKeys,
        completeMatchingKeys,
        ifDeleted,
        ifDataSegregation,
      }) : {
        ...publicData,
        ...(objToSnakeCase(data2) || {}),
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
        pageNum,
        pageSize,
        list: list1,
        total: count,
        ifFirst: pageNum === 1,
        ifLast: Math.ceil(count / pageSize) === pageNum,
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
   * @param ifDataSegregation
   * @param ifUseGenSelParams
   */
  async findAll<T, P = object>(model: string, {
                                 data,
                                 orderBy,
                                 range = {},
                                 notNullKeys = [],
                                 numberKeys = [],
                                 completeMatchingKeys = [],
                                 ifDeleted = true,
                                 ifDataSegregation = false,
                               }: {
                                 data?: P,
                                 orderBy?: boolean | object,
                                 range?: object,
                                 notNullKeys?: string[]
                                 numberKeys?: string[]
                                 completeMatchingKeys?: string[]
                                 ifDeleted?: boolean,
                                 ifDataSegregation?: boolean,
                               } = {},
                               ifUseGenSelParams = true,
  ): Promise<T[]> {
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, P>({
        data,
        orderBy,
        range,
        notNullKeys,
        numberKeys,
        completeMatchingKeys,
        ifDeleted,
        ifDataSegregation,
      }) : {
        ...this.defaultSelArg({ ifDeleted, ifDataSegregation }).where,
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
   * @param ifDataSegregation
   */
  async findFirst<T, P = any>(model: string, args?: Partial<P>, {
                                ifDeleted = true,
                                ifDataSegregation = false,
                              }: {
                                ifDeleted?: boolean
                                ifDataSegregation?: boolean
                              } = {},
  ): Promise<T> {
    const arg = {
      where: {
        ...this.defaultSelArg({ ifDeleted, ifDataSegregation }).where,
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
   * @param ifDataSegregation
   */
  async findById<T>(model: string, id: number | string, {
                      ifDeleted = true,
                      ifDataSegregation = false,
                    }: {
                      ifDeleted?: boolean
                      ifDataSegregation?: boolean
                    } = {},
  ): Promise<T> {
    return this.findFirst<T>(model, { id: id }, { ifDeleted, ifDataSegregation });
  }

  /**
   * 查询多个（根据id）
   * @param model
   * @param ids
   * @param ifDeleted
   * @param ifDataSegregation
   */
  async findByIds<T>(model: string, ids: number[] | string[], {
                       ifDeleted = true,
                       ifDataSegregation = false,
                     }: {
                       ifDeleted?: boolean
                       ifDataSegregation?: boolean
                     } = {},
  ): Promise<T[]> {
    const arg = {
      where: {
        ...this.defaultSelArg({ ifDeleted, ifDataSegregation }).where,
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
   * @param ifDataSegregation
   * @param ifUseGenSelParams
   */
  async count<T, P = object>(model: string, {
                               data,
                               range = {},
                               notNullKeys = [],
                               numberKeys = [],
                               completeMatchingKeys = [],
                               ifDeleted = true,
                               ifDataSegregation = false,
                             }: {
                               data?: P,
                               range?: object,
                               notNullKeys?: string[]
                               numberKeys?: string[]
                               completeMatchingKeys?: string[]
                               ifDeleted?: boolean,
                               ifDataSegregation?: boolean,
                             } = {},
                             ifUseGenSelParams = true,
  ): Promise<number> {
    const arg: any = {
      where: ifUseGenSelParams ? this.genSelParams<T, P>({
        data,
        range,
        notNullKeys,
        numberKeys,
        completeMatchingKeys,
        ifDeleted,
        ifDataSegregation,
      }) : {
        ...this.defaultSelArg({ ifDeleted, ifDataSegregation }).where,
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
    const data2 = deepClone(data);
    if (!ifCustomizeId) {
      delete data2.id;
    }
    const publicData = this.defaultInsArg({ ifCreateBy, ifUpdateBy, ifCreateTime, ifUpdateTime, ifDeleted }).data;
    const arg = {
      data: {
        ...publicData,
        ...(objToSnakeCase(data2) || {}),
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
   * @param ifDataSegregation
   */
  async updateById<T>(model: string, data?: any, {
                        ifUpdateBy = true,
                        ifUpdateTime = true,
                        ifDeleted = true,
                        ifDataSegregation = false,
                      }: {
                        ifUpdateBy?: boolean,
                        ifUpdateTime?: boolean,
                        ifDeleted?: boolean,
                        ifDataSegregation?: boolean
                      } = {},
  ): Promise<T> {
    const id = data.id;
    const data2 = deepClone(data);
    delete data2.id;
    const publicData = this.defaultUpdArg({ ifUpdateBy, ifUpdateTime, ifDeleted, ifDataSegregation });
    const arg = {
      where: {
        ...publicData.where,
        id: id,
      },
      data: {
        ...objToSnakeCase(data2),
        ...publicData.data,
      },
    };
    try {
      const retData = await this.getModel(model).update(arg);
      return new Promise(resolve => resolve(objToCamelCase(retData)));
    } catch (e) {
      return new Promise(resolve => resolve(JSON.parse(JSON.stringify({}))));
    }
  }

  /**
   * 批量修改
   * @param model
   * @param data
   * @param ifUpdateBy
   * @param ifUpdateTime
   * @param ifDeleted
   * @param ifDataSegregation
   */
  async updateMany<T>(model: string, data?: any[], {
                        ifUpdateBy = true,
                        ifUpdateTime = true,
                        ifDeleted = true,
                        ifDataSegregation = false,
                      }: {
                        ifUpdateBy?: boolean,
                        ifUpdateTime?: boolean,
                        ifDeleted?: boolean,
                        ifDataSegregation?: boolean
                      } = {},
  ): Promise<T[]> {
    const retArr: T[] = [];
    for (let i = 0; i < data.length; i++) {
      const ret = await this.updateById<T>(model, data[i], { ifUpdateBy, ifUpdateTime, ifDeleted, ifDataSegregation });
      retArr.push(ret);
    }
    return new Promise(resolve => resolve(retArr));
  }

  /**
   * 批量删除
   * @param model
   * @param ids
   * @param ifDataSegregation
   */
  async deleteById<T>(model: string, ids: number[] | string[], {
                        ifDataSegregation = false,
                      }: {
                        ifDataSegregation?: boolean
                      } = {},
  ): Promise<{ count: number }> {
    const publicData = this.defaultDelArg({ ifDataSegregation });
    const arg = {
      where: {
        ...publicData.where,
        id: {
          in: ids,
        },
      },
      data: {
        ...publicData.data,
      },
    };
    return this.getModel(model).updateMany(arg);
  }

  /**
   * 条件删除
   * @param model
   * @param key
   * @param values
   * @param ifDataSegregation
   */
  async delete<T>(model: string, key: string, values: any[], {
                    ifDataSegregation = false,
                  }: {
                    ifDataSegregation?: boolean
                  } = {},
  ): Promise<{ count: number }> {
    const publicData = this.defaultDelArg({ ifDataSegregation });
    const arg = {
      where: {
        ...publicData.where,
        [key]: {
          in: values,
        },
      },
      data: {
        ...publicData.data,
      },
    };
    return this.getModel(model).updateMany(arg);
  }
}
