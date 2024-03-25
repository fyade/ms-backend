import { Injectable } from '@nestjs/common';
import { currentEnv } from '../config/config';
import { base } from '../util/base';
import { getCurrentUser } from '../util/baseContext';
import { time } from '../util/TimeUtils';
import { UnknownException } from '../exception/UnknownException';
import { pageSelDto } from '../common/dto/PageDto';
import { withWhere } from '../common/commonType';

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
   * @param data
   */
  async findPage_<T, P extends pageSelDto>(model: string, data: P): Promise<{
    list: T[]
    total: number
  }> {
    const pageNum = Number(data.pageNum);
    const pageSize = Number(data.pageSize);
    delete data.pageNum;
    delete data.pageSize;
    const arg = {
      where: {
        ...this.defaultSelArg().where,
        ...(data || {}),
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };
    const model1 = this.getModel(model);
    const list = await model1.findMany(arg);
    const count = await model1.count({
      where: this.defaultSelArg().where,
    });
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
   */
  async findAll<T>(model: string, args?: any): Promise<T[]> {
    const arg = {
      where: {
        ...this.defaultSelArg().where,
        ...(args || {}),
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
  async findById_<T>(model: string, id: any): Promise<T> {
    return this.findFirst<T>(model, { id: id });
  }

  /**
   * 增
   * @param model
   * @param data
   */
  async create_<T>(model: string, data: any): Promise<T> {
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
   * 删
   * @param model
   * @param ids
   */
  async deleteById_<T>(model: string, ids: any[]): Promise<{ count: number }> {
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
   * 改
   * @param model
   * @param data
   */
  async updateById_<T>(model: string, data?: any): Promise<T> {
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

  // /**
  //  * 查
  //  * @param model
  //  * @param args
  //  */
  // private async findMany<T>(model: string, args?: any): Promise<T[]> {
  //   const arg = {
  //     ...args,
  //     where: {
  //       ...this.defaultSelArg().where,
  //       ...(args?.where || {}),
  //     },
  //   };
  //   return this.getModel(model).findMany(arg);
  // }

  // /**
  //  * 查
  //  * @param model
  //  * @param args
  //  */
  // private async findPage<T, P extends pageSelDto & withWhere>(model: string, args?: P): Promise<{
  //   list: T[]
  //   total: number
  // }> {
  //   const arg = {
  //     ...args,
  //     where: {
  //       ...this.defaultSelArg().where,
  //       ...(args?.where || {}),
  //     },
  //     skip: (Number(args.pageNum) - 1) * Number(args.pageSize),
  //     take: Number(args.pageSize),
  //   };
  //   delete arg.pageNum;
  //   delete arg.pageSize;
  //   const model1 = this.getModel(model);
  //   const list = await model1.findMany(arg);
  //   const count = await model1.count({
  //     where: this.defaultSelArg().where,
  //   });
  //   return new Promise((resolve) => {
  //     resolve({
  //       list: list,
  //       total: count,
  //     });
  //   });
  // }

  // /**
  //  * 查
  //  * @param model
  //  * @param args
  //  */
  // async findUnique<T>(model: string, args?: any): Promise<T> {
  //   const arg = {
  //     ...args,
  //     where: {
  //       ...this.defaultSelArg().where,
  //       ...(args?.where || {}),
  //     },
  //   };
  //   return this.getModel(model).findUnique(arg);
  // }

  // /**
  //  * 增
  //  * @param model
  //  * @param args
  //  */
  // async create<T>(model: string, args?: any): Promise<T> {
  //   delete args?.data.id;
  //   const arg = {
  //     ...args,
  //     data: {
  //       ...this.defaultInsArg().data,
  //       ...(args?.data || {}),
  //     },
  //   };
  //   return this.getModel(model).create(arg);
  // }

  // /**
  //  * 增
  //  * @param model
  //  * @param args
  //  */
  // async createMany<T>(model: string, args?: any): Promise<{ count: number }> {
  //   const arg = {
  //     ...args,
  //     data: (args?.data || []).map((item: object) => {
  //       return {
  //         ...this.defaultInsArg().data,
  //         ...item,
  //       };
  //     }),
  //   };
  //   return this.getModel(model).createMany(arg);
  // }

  // /**
  //  * 删
  //  * @param model
  //  * @param args
  //  */
  // async deleteMany<T>(model: string, args?: any): Promise<{ count: number }> {
  //   const arg = {
  //     ...args,
  //     where: {
  //       ...this.defaultDelArg().where,
  //       ...(args?.where || {}),
  //     },
  //     data: {
  //       ...this.defaultDelArg().data,
  //       ...(args?.data || {}),
  //     },
  //   };
  //   return this.getModel(model).updateMany(arg);
  // }

  // /**
  //  * 改
  //  * @param model
  //  * @param args
  //  */
  // async update<T>(model: string, args?: any): Promise<T> {
  //   const arg = {
  //     ...args,
  //     where: {
  //       ...this.defaultUpdArg().where,
  //       ...(args?.where || {}),
  //     },
  //     data: {
  //       ...this.defaultUpdArg().data,
  //       ...(args?.data || {}),
  //     },
  //   };
  //   return this.getModel(model).update(arg);
  // }

  // /**
  //  * 改
  //  * @param model
  //  * @param args
  //  */
  // async updateMany<T>(model: string, args?: any): Promise<{ count: number }> {
  //   const arg = {
  //     ...args,
  //     where: {
  //       ...this.defaultUpdArg().where,
  //       ...(args?.where || {}),
  //     },
  //     data: {
  //       ...this.defaultUpdArg().data,
  //       ...(args?.data || {}),
  //     },
  //   };
  //   return this.getModel(model).updateMany(arg);
  // }
}
