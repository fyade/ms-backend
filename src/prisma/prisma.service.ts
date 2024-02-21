import { Injectable } from '@nestjs/common';
import { currentEnv } from '../config/config';
import { base } from '../util/base';
import { getCurrentUser } from '../util/baseContext';
import { time } from '../util/TimeUtils';
import { UnknownException } from '../exception/UnknownException';

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
   * @param args
   */
  async findMany<T>(model: string, args?: any): Promise<T[]> {
    const arg = {
      ...args,
      where: {
        ...this.defaultSelArg().where,
        ...(args?.where || {}),
      },
    };
    return this.getModel(model).findMany(arg);
  }

  /**
   * 查
   * @param model
   * @param args
   */
  async findFirst<T>(model: string, args?: any): Promise<T> {
    const arg = {
      ...args,
      where: {
        ...this.defaultSelArg().where,
        ...(args?.where || {}),
      },
    };
    return this.getModel(model).findFirst(arg);
  }

  /**
   * 查
   * @param model
   * @param args
   */
  async findUnique<T>(model: string, args?: any): Promise<T> {
    const arg = {
      ...args,
      where: {
        ...this.defaultSelArg().where,
        ...(args?.where || {}),
      },
    };
    return this.getModel(model).findUnique(arg);
  }

  /**
   * 增
   * @param model
   * @param args
   */
  async create<T>(model: string, args?: any): Promise<T> {
    const arg = {
      ...args,
      data: {
        ...this.defaultInsArg().data,
        ...(args?.data || {}),
      },
    };
    return this.getModel(model).create(arg);
  }

  /**
   * 增
   * @param model
   * @param args
   */
  async createMany<T>(model: string, args?: any): Promise<{ count: number }> {
    const arg = {
      ...args,
      data: (args?.data || []).map((item: object) => {
        return {
          ...this.defaultInsArg().data,
          ...item,
        };
      }),
    };
    return this.getModel(model).createMany(arg);
  }

  /**
   * 删
   * @param model
   * @param args
   */
  async deleteMany<T>(model: string, args?: any): Promise<{ count: number }> {
    const arg = {
      ...args,
      where: {
        ...this.defaultDelArg().where,
        ...(args?.where || {}),
      },
      data: {
        ...this.defaultDelArg().data,
        ...(args?.data || {}),
      },
    };
    return this.getModel(model).updateMany(arg);
  }

  /**
   * 改
   * @param model
   * @param args
   */
  async update<T>(model: string, args?: any): Promise<T> {
    const arg = {
      ...args,
      where: {
        ...this.defaultUpdArg().where,
        ...(args?.where || {}),
      },
      data: {
        ...this.defaultUpdArg().data,
        ...(args?.data || {}),
      },
    };
    return this.getModel(model).update(arg);
  }

  /**
   * 改
   * @param model
   * @param args
   */
  async updateMany<T>(model: string, args?: any): Promise<{ count: number }> {
    const arg = {
      ...args,
      where: {
        ...this.defaultUpdArg().where,
        ...(args?.where || {}),
      },
      data: {
        ...this.defaultUpdArg().data,
        ...(args?.data || {}),
      },
    };
    return this.getModel(model).updateMany(arg);
  }
}
