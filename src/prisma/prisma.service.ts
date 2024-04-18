import { Injectable } from '@nestjs/common';
import { currentEnv } from '../config/config';
import { base } from '../util/base';
import { getCurrentUser } from '../util/baseContext';
import { time } from '../util/TimeUtils';
import { UnknownException } from '../exception/UnknownException';
import { pageSelDto } from '../common/dto/PageDto';
import { deepClone } from '../util/ObjectUtils';

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

  /**
   * 查
   * @param model
   * @param data
   * @param orderBy
   * @param notNullKeys
   */
  async findPage<T, P extends pageSelDto>(model: string, {
                                            data,
                                            orderBy,
                                            notNullKeys = [],
                                          }: {
                                            data?: P,
                                            orderBy?: boolean
                                            notNullKeys?: string[]
                                          } = {},
  ): Promise<{
    list: T[]
    total: number
  }> {
    const pageNum = Number(data.pageNum);
    const pageSize = Number(data.pageSize);
    delete data.pageNum;
    delete data.pageSize;
    const arg: any = {
      where: {
        AND: [
          ...Object.keys(this.defaultSelArg().where).reduce((obj, item) => [
            ...obj,
            {
              [item]: this.defaultSelArg().where[item],
            },
          ], []),
          ...Object.keys(data).reduce((obj, item) => [
            ...obj,
            {
              OR: [
                {
                  [item]: {
                    contains: `${data[item]}`,
                  },
                },
                {
                  [item]: null,
                },
              ].slice(0, (notNullKeys.indexOf(item) > -1 || data[item] !== '') ? 1 : 2),
            },
          ], []),
        ],
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
    const arg2 = {
      where: arg.where,
    };
    const count = await model1.count(arg2);
    return new Promise((resolve) => {
      resolve({
        list: list,
        total: count,
      });
    });
  }

  /**
   * 查
   * @param model
   * @param args
   * @param orderBy
   */
  async findAll<T>(model: string, args?: any, orderBy?: boolean): Promise<T[]> {
    const arg: any = {
      where: {
        ...this.defaultSelArg().where,
        ...(args || {}),
      },
    };
    if (orderBy) {
      arg.orderBy = {
        order_num: 'asc',
      };
    }
    const res2 = await this.getModel(model).findMany(arg);
    return new Promise(resolve => resolve(res2));
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
        ...(args || {}),
      },
    };
    return this.getModel(model).findFirst(arg);
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
    return this.getModel(model).findMany(arg);
  }

  /**
   * 增
   * @param model
   * @param data
   */
  async create<T>(model: string, data: any): Promise<T> {
    delete data.id;
    const arg = {
      data: {
        ...this.defaultInsArg().data,
        ...(data || {}),
      },
    };
    return this.getModel(model).create(arg);
  }

  /**
   * 增
   * @param model
   * @param data
   */
  async createMany<T>(model: string, data: any[]): Promise<T> {
    const arg = {
      data: data.map(dat => ({
        ...this.defaultInsArg().data,
        ...(dat || {}),
      })),
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
        ...data,
      },
    };
    return this.getModel(model).update(arg);
  }
}
