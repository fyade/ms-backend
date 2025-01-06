import { Injectable } from '@nestjs/common';
import { currentEnv, getMysqlUrlFromEnv } from '../../config/config';
import { base, T_DEPT, T_ROLE } from '../util/base';
import { time } from '../util/TimeUtils';
import { UnknownException } from '../exception/UnknownException';
import { PageDto } from '../common/dto/PageDto';
import { objToCamelCase, objToSnakeCase, toSnakeCase, toSnakeCases, typeOf } from '../util/BaseUtils';
import { PageVo } from '../common/vo/PageVo';
import { deepClone } from '../util/ObjectUtils';
import { BaseContextService } from '../module/base-context/base-context.service';
import { PrismaClient } from '@prisma/client';
import { baseInterfaceColumns2 } from '../module/module/main/sys-util/code-generation/codeGeneration';
import { Exception } from '../exception/Exception';
import { PrismaParam, SelectParamObj } from './dto';

const env = currentEnv();
const { PrismaClient: PrismaClientOrigin } = require(env.mode === base.DEV ? '@prisma/client' : '../../generated/client');

@Injectable()
export class PrismaService extends PrismaClientOrigin {
  private prismaClient: PrismaClient;

  constructor(
    private readonly bcs: BaseContextService,
  ) {
    const dbConfig = {
      datasources: {
        db: {
          url: getMysqlUrlFromEnv(env),
        },
      },
      log: env.mode === base.DEV ? ['query', 'info', 'warn'] : [],
    };
    super(dbConfig);
    // 使用中间件对查询结果中的 Bigint 类型进行序列化
    super.$use(async (params, next) => {
      const t1 = Date.now();
      const result = await next(params);
      const t2 = Date.now();
      if ([base.DEV, base.TEST].includes(currentEnv().mode)) {
        console.info(`Query ${params.model}.${params.action} took ${t2 - t1}ms`);
      }
      return this.serialize(result);
    });
    this.prismaClient = new PrismaClientOrigin(dbConfig);
  }

  getOrigin() {
    return this.prismaClient;
  }

  private getUserId() {
    return this.bcs.getUserData().userId || '???';
  }

  private getLoginRole() {
    return this.bcs.getUserData().loginRole || '???';
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

  defaultSelArg = ({
                     selKeys = [],
                     ifDeleted = true,
                     ifUseSelfData = false,
                   }: {
                     selKeys?: string[],
                     ifDeleted?: boolean,
                     ifUseSelfData?: boolean,
                   } = {},
  ) => {
    const retObj = {
      ...(selKeys.length > 0 ? {
        select: [...selKeys, ...baseInterfaceColumns2].reduce((o, a) => ({
          ...o,
          [toSnakeCase(a)]: true,
        }), {}),
      } : {}),
      where: {
        create_role: this.getLoginRole(),
        create_by: this.getUserId(),
        deleted: base.N,
      },
    };
    if (!ifDeleted) delete retObj.where.deleted;
    if (!ifUseSelfData) {
      delete retObj.where.create_role;
      delete retObj.where.create_by;
    }
    return retObj;
  };
  defaultInsArg = ({
                     ifCreateRole = true,
                     ifUpdateRole = true,
                     ifCreateBy = true,
                     ifUpdateBy = true,
                     ifCreateTime = true,
                     ifUpdateTime = true,
                     ifDeleted = true,
                   }: {
                     ifCreateRole?: boolean,
                     ifUpdateRole?: boolean,
                     ifCreateBy?: boolean,
                     ifUpdateBy?: boolean,
                     ifCreateTime?: boolean,
                     ifUpdateTime?: boolean,
                     ifDeleted?: boolean,
                   } = {},
  ) => {
    const userid = this.getUserId();
    const time1 = time();
    const retObj = {
      data: {
        create_role: this.getLoginRole(),
        update_role: this.getLoginRole(),
        create_by: userid,
        update_by: userid,
        create_time: time1,
        update_time: time1,
        deleted: base.N,
      },
    };
    if (!ifCreateRole) delete retObj.data.create_role;
    if (!ifUpdateRole) delete retObj.data.update_role;
    if (!ifCreateBy) delete retObj.data.create_by;
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifCreateTime) delete retObj.data.create_time;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.data.deleted;
    return retObj;
  };
  defaultUpdArg = ({
                     ifUpdateRole = true,
                     ifUpdateBy = true,
                     ifUpdateTime = true,
                     ifDeleted = true,
                     ifUseSelfData = false,
                   }: {
                     ifUpdateRole?: boolean,
                     ifUpdateBy?: boolean,
                     ifUpdateTime?: boolean,
                     ifDeleted?: boolean,
                     ifUseSelfData?: boolean,
                   } = {},
  ) => {
    const retObj = {
      where: {
        create_role: this.getLoginRole(),
        create_by: this.getUserId(),
        deleted: base.N,
      },
      data: {
        update_role: this.getLoginRole(),
        update_by: this.getUserId(),
        update_time: time(),
      },
    };
    if (!ifUpdateRole) delete retObj.data.update_role;
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.where.deleted;
    if (!ifUseSelfData) {
      delete retObj.where.create_role;
      delete retObj.where.create_by;
    }
    return retObj;
  };
  defaultDelArg = ({
                     ifUseSelfData = false,
                   }: {
                     ifUseSelfData?: boolean
                   } = {},
  ) => {
    const retObj = {
      where: {
        create_role: this.getLoginRole(),
        create_by: this.getUserId(),
        deleted: base.N,
      },
      data: {
        update_role: this.getLoginRole(),
        update_by: this.getUserId(),
        update_time: time(),
        deleted: base.Y,
      },
    };
    if (!ifUseSelfData) {
      delete retObj.where.create_role;
      delete retObj.where.create_by;
    }
    return retObj;
  };

  /**
   * 数据表行级别权限控制
   * @param model
   * @param arg
   * @private
   */
  private async tableRowPermission<T>({
                                        model,
                                        arg,
                                      }: {
                                        model: string,
                                        arg: PrismaParam
                                      },
  ): Promise<boolean | string | { key: string, value: (number | string)[] }> {
    const userData = this.bcs.getUserData();
    const permissionData = await this.getOrigin().sys_menu.findFirst({
      where: {
        perms: userData.perms,
        type: 'mb',
        ...this.defaultSelArg().where,
      },
    });
    if (!permissionData) {
      console.error(`不存在的权限：${userData.perms}`);
      throw new UnknownException(userData.reqId);
    }
    const ifTopAdmin = userData.topAdmin;
    if (ifTopAdmin) {
      return true;
    }
    // 用户的角色/部门
    const userRoles_ = await this.getOrigin().sys_user_role.findMany({
      where: {
        user_id: userData.userId,
        ...this.defaultSelArg().where,
      },
    });
    const userDepts_ = await this.getOrigin().sys_user_dept.findMany({
      where: {
        user_id: userData.userId,
        ...this.defaultSelArg().where,
      },
    });
    const userRoles = await this.getOrigin().sys_role.findMany({
      where: {
        if_admin: base.Y,
        if_disabled: base.N,
        id: {
          in: userRoles_.map(item => item.role_id),
        },
        ...this.defaultSelArg().where,
      },
    });
    const userDepts = await this.getOrigin().sys_dept.findMany({
      where: {
        if_admin: base.Y,
        if_disabled: base.N,
        id: {
          in: userDepts_.map(item => item.dept_id),
        },
        ...this.defaultSelArg().where,
      },
    });
    const trpsRole = await this.getOrigin().sys_table_row_permission.findMany({
      where: {
        action_type: T_ROLE,
        action_id: {
          in: userRoles.map(item => item.id).map(_ => `${_}`),
        },
        permission_id: permissionData.id,
        ...this.defaultSelArg().where,
      },
    });
    const trpsDept = await this.getOrigin().sys_table_row_permission.findMany({
      where: {
        action_type: T_DEPT,
        action_id: {
          in: userDepts.map(item => item.id).map(_ => `${_}`),
        },
        permission_id: permissionData.id,
        ...this.defaultSelArg().where,
      },
    });
    const trps = [...trpsRole, ...trpsDept];
    if (trps.length === 0) {
      return true;
    }
    const dataTypes = trps.map(item => item.data_type);
    // 注：同一权限类型同一权限只能设置一个数据类型
    if (dataTypes.includes('ALL')) {
      return true;
    }
    if (dataTypes.includes('SELF')) {
      return 'self';
    }
    if (dataTypes.includes('SELF_ROLE')) {
      console.log('===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====', model, JSON.stringify(arg));
    }
  }

  private getModel(model: string) {
    const modelInstance = this[model];
    if (!modelInstance) {
      throw new UnknownException(this.bcs.getUserData().reqId);
    }
    return modelInstance;
  }

  private genSelParams<T, P>({
                               data,
                               orderBy,
                               range = {},
                               selKeys = [],
                               notNullKeys = [],
                               numberKeys = [],
                               completeMatchingKeys = [],
                               ifDeleted = true,
                               ifUseSelfData = false,
                             }: {
                               data?: P,
                               orderBy?: boolean | object,
                               range?: object,
                               selKeys?: string[],
                               notNullKeys?: string[],
                               numberKeys?: string[],
                               completeMatchingKeys?: string[],
                               ifDeleted?: boolean,
                               ifUseSelfData?: boolean,
                             } = {},
  ) {
    const data_ = objToSnakeCase(data);
    const publicData = this.defaultSelArg({ selKeys, ifDeleted, ifUseSelfData }).where;
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
          // 开始拼接查询条件
          const obj2 = {
            OR: [],
          };
          // 如果这个字段接收到的是对象类型
          if (typeOf(datum) === 'object') {
            const items = { [item]: {} };
            const datum_ = new SelectParamObj(datum as unknown as SelectParamObj);
            for (const itm of Object.keys(datum_)) {
              // 如果指定为数值类型
              if (datum_[itm].type === 'number') {
                switch (typeOf(datum_[itm].value)) {
                  case 'array':
                    items[item][itm] = datum_[itm].value.map(n => Number(n));
                    break;
                  // case 'object':
                  //   items[item][itm] = Object.keys(datum_[itm].value)
                  //     .reduce((obj, key) => ({ ...obj, [key]: Number(datum_[itm].value[key]) }), {});
                  //   break;
                  case 'string':
                    items[item][itm] = Number(datum_[itm].value);
                    break;
                  default:
                    items[item][itm] = datum_[itm].value;
                    break;
                }
              }
              // 未指定类型，原样返回
              else {
                items[item][itm] = datum_[itm].value;
              }
            }
            obj2.OR.push(items);
          } else {
            // 数字
            if (toSnakeCases(numberKeys).includes(item)) {
              obj2.OR.push({ [item]: Number(datum) });
            }
            // 字符串完整匹配
            else if (toSnakeCases(completeMatchingKeys).includes(item) && !!datum) {
              obj2.OR.push({ [item]: `${datum}` });
            }
            // 字符串模糊匹配
            else {
              obj2.OR.push({ [item]: { contains: `${datum}` } });
            }
            // 可以为空
            if (!toSnakeCases(notNullKeys).includes(item)) {
              obj2.OR.push({ [item]: null });
            }
          }
          return [...obj, obj2];
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
   * @param selKeys
   * @param ifUseSelfData
   */
  async findPage<T, P extends PageDto>(model: string, {
                                         data,
                                         orderBy,
                                         range = {},
                                         selKeys = [],
                                         ifUseSelfData = false,
                                       }: {
                                         data?: P,
                                         orderBy?: boolean | object,
                                         range?: object,
                                         selKeys?: string[],
                                         ifUseSelfData?: boolean,
                                       } = {},
  ): Promise<PageVo<T>> {
    const pageNum = Number(data.pageNum);
    const pageSize = Number(data.pageSize);
    const data2 = deepClone(data);
    delete data2.pageNum;
    delete data2.pageSize;
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.defaultSelArg({ selKeys, ifDeleted: fieldSelectParam.ifDeleted, ifUseSelfData });
    const arg: PrismaParam = {
      where: this.genSelParams<T, P>({
        data: data2,
        orderBy,
        range,
        selKeys,
        notNullKeys: fieldSelectParam.notNullKeys,
        numberKeys: fieldSelectParam.numberKeys,
        completeMatchingKeys: fieldSelectParam.completeMatchingKeys,
        ifDeleted: fieldSelectParam.ifDeleted,
        ifUseSelfData,
      }),
      ...(publicData.select ? { select: publicData.select } : {}),
      skip: this.getSkipAndTakeFromPNS(pageNum, pageSize).skip,
      take: this.getSkipAndTakeFromPNS(pageNum, pageSize).take,
    };
    if (typeof orderBy === 'boolean' && orderBy) {
      arg['orderBy'] = {
        order_num: 'asc',
      };
    } else if (orderBy) {
      arg['orderBy'] = {
        [toSnakeCase(Object.keys(orderBy)[0])]: Object.values(orderBy)[0],
      };
    } else {
      arg['orderBy'] = {
        create_time: 'desc',
      };
    }
    const model1 = this.getModel(model);
    const list = await model1.findMany(arg);
    const list1 = list.map((item: object) => objToCamelCase(item));
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
   * @param selKeys
   * @param ifUseSelfData
   */
  async findAll<T, P = object>(model: string, {
                                 data,
                                 orderBy,
                                 range = {},
                                 selKeys = [],
                                 ifUseSelfData = false,
                               }: {
                                 data?: P,
                                 orderBy?: boolean | object,
                                 range?: object,
                                 selKeys?: string[],
                                 ifUseSelfData?: boolean,
                               } = {},
  ): Promise<T[]> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.defaultSelArg({ selKeys, ifDeleted: fieldSelectParam.ifDeleted, ifUseSelfData });
    const arg = {
      where: this.genSelParams<T, P>({
        data,
        orderBy,
        range,
        selKeys,
        notNullKeys: fieldSelectParam.notNullKeys,
        numberKeys: fieldSelectParam.numberKeys,
        completeMatchingKeys: fieldSelectParam.completeMatchingKeys,
        ifDeleted: fieldSelectParam.ifDeleted,
        ifUseSelfData,
      }),
      ...(publicData.select ? { select: publicData.select } : {}),
    };
    if (typeof orderBy === 'boolean' && orderBy) {
      arg['orderBy'] = {
        order_num: 'asc',
      };
    } else if (orderBy) {
      arg['orderBy'] = {
        [toSnakeCase(Object.keys(orderBy)[0])]: Object.values(orderBy)[0],
      };
    } else {
      arg['orderBy'] = {
        create_time: 'desc',
      };
    }
    const res2 = await this.getModel(model).findMany(arg);
    const res3 = res2.map((item: object) => objToCamelCase(item));
    return new Promise(resolve => resolve(res3));
  }

  /**
   * 查询首个
   * @param model
   * @param args
   * @param selKeys
   * @param ifUseSelfData
   */
  async findFirst<T, P = any>(model: string, args?: Partial<P>, {
                                selKeys = [],
                                ifUseSelfData = false,
                              }: {
                                selKeys?: string[],
                                ifUseSelfData?: boolean,
                              } = {},
  ): Promise<T> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.defaultSelArg({ selKeys, ifDeleted: fieldSelectParam.ifDeleted, ifUseSelfData });
    const arg = {
      where: {
        ...publicData.where,
        ...(objToSnakeCase(args) || {}),
      },
      ...(publicData.select ? { select: publicData.select } : {}),
    };
    const first = await this.getModel(model).findFirst(arg);
    const objToCamelCase1 = objToCamelCase<T>(first);
    return new Promise(resolve => resolve(objToCamelCase1));
  }

  /**
   * 查询单个
   * @param model
   * @param id
   * @param selKeys
   * @param ifUseSelfData
   */
  async findById<T>(model: string, id: number | string, {
                      selKeys = [],
                      ifUseSelfData = false,
                    }: {
                      selKeys?: string[],
                      ifUseSelfData?: boolean,
                    } = {},
  ): Promise<T> {
    return this.findFirst<T>(model, { id: id }, { selKeys, ifUseSelfData });
  }

  /**
   * 查询多个（根据id）
   * @param model
   * @param ids
   * @param selKeys
   * @param ifUseSelfData
   */
  async findByIds<T>(model: string, ids: number[] | string[], {
                       selKeys = [],
                       ifUseSelfData = false,
                     }: {
                       selKeys?: string[],
                       ifUseSelfData?: boolean,
                     } = {},
  ): Promise<T[]> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.defaultSelArg({ selKeys, ifDeleted: fieldSelectParam.ifDeleted, ifUseSelfData });
    const arg = {
      where: {
        ...publicData.where,
        id: {
          in: ids,
        },
      },
      ...(publicData.select ? { select: publicData.select } : {}),
    };
    const list = await this.getModel(model).findMany(arg);
    const list2 = ids.map((id) => objToCamelCase<T>(list.find(item => item.id === id)));
    return new Promise(resolve => resolve(list2));
  }

  /**
   * 数量
   * @param model
   * @param data
   * @param range
   * @param ifUseSelfData
   */
  async count<T, P = object>(model: string, {
                               data,
                               range = {},
                               ifUseSelfData = false,
                             }: {
                               data?: P,
                               range?: object,
                               ifUseSelfData?: boolean,
                             } = {},
  ): Promise<number> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const arg = {
      where: this.genSelParams<T, P>({
        data,
        range,
        notNullKeys: fieldSelectParam.notNullKeys,
        numberKeys: fieldSelectParam.numberKeys,
        completeMatchingKeys: fieldSelectParam.completeMatchingKeys,
        ifDeleted: fieldSelectParam.ifDeleted,
        ifUseSelfData,
      }),
    };
    const count = await this.getModel(model).count(arg);
    return new Promise(resolve => resolve(count));
  }

  /**
   * 新增
   * @param model
   * @param data
   * @param ifCustomizeId
   */
  async create<T>(model: string, data, {
                    ifCustomizeId = false,
                  }: {
                    ifCustomizeId?: boolean,
                  } = {},
  ): Promise<T> {
    const data2 = deepClone(data);
    if (!ifCustomizeId) {
      delete data2.id;
    }
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.defaultInsArg({
      ifCreateRole: fieldSelectParam.ifCreateRole,
      ifUpdateRole: fieldSelectParam.ifUpdateRole,
      ifCreateBy: fieldSelectParam.ifCreateBy,
      ifUpdateBy: fieldSelectParam.ifUpdateBy,
      ifCreateTime: fieldSelectParam.ifCreateTime,
      ifUpdateTime: fieldSelectParam.ifUpdateTime,
      ifDeleted: fieldSelectParam.ifDeleted,
    }).data;
    const arg = {
      data: {
        ...(objToSnakeCase(data2) || {}),
        ...publicData,
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
   */
  async createMany<T>(model: string, data, {
                        ifCustomizeId = false,
                      }: {
                        ifCustomizeId?: boolean,
                      } = {},
  ): Promise<T> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.defaultInsArg({
      ifCreateRole: fieldSelectParam.ifCreateRole,
      ifUpdateRole: fieldSelectParam.ifUpdateRole,
      ifCreateBy: fieldSelectParam.ifCreateBy,
      ifUpdateBy: fieldSelectParam.ifUpdateBy,
      ifCreateTime: fieldSelectParam.ifCreateTime,
      ifUpdateTime: fieldSelectParam.ifUpdateTime,
      ifDeleted: fieldSelectParam.ifDeleted,
    }).data;
    const arg = {
      data: data.map(dat => {
        if (!ifCustomizeId) {
          delete dat.id;
        }
        return {
          ...(objToSnakeCase(dat) || {}),
          ...publicData,
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
   * @param ifUseSelfData
   */
  async updateById<T>(model: string, data?, {
                        ifUseSelfData = false,
                      }: {
                        ifUseSelfData?: boolean
                      } = {},
  ): Promise<T> {
    const id = data.id;
    const data2 = deepClone(data);
    delete data2.id;
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.defaultUpdArg({
      ifUpdateRole: fieldSelectParam.ifUpdateRole,
      ifUpdateBy: fieldSelectParam.ifUpdateBy,
      ifUpdateTime: fieldSelectParam.ifUpdateTime,
      ifDeleted: fieldSelectParam.ifDeleted,
      ifUseSelfData,
    });
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
   * @param ifUseSelfData
   */
  async updateMany<T>(model: string, data?, {
                        ifUseSelfData = false,
                      }: {
                        ifUseSelfData?: boolean
                      } = {},
  ): Promise<T[]> {
    const retArr: T[] = [];
    for (let i = 0; i < data.length; i++) {
      const ret = await this.updateById<T>(model, data[i], {
        ifUseSelfData,
      });
      retArr.push(ret);
    }
    return new Promise(resolve => resolve(retArr));
  }

  /**
   * 批量删除
   * @param model
   * @param ids
   * @param ifUseSelfData
   */
  async deleteById<T>(model: string, ids: number[] | string[], {
                        ifUseSelfData = false,
                      }: {
                        ifUseSelfData?: boolean
                      } = {},
  ): Promise<{ count: number }> {
    const publicData = this.defaultDelArg({ ifUseSelfData });
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
    const many: { count: number } = await this.getModel(model).updateMany(arg);
    if (ids.length !== 0 && many.count === 0) {
      throw new Exception('【开发中】你可能无权限。');
    }
    return new Promise(resolve => resolve(many));
  }

  /**
   * 条件删除
   * @param model
   * @param key
   * @param values
   * @param ifUseSelfData
   */
  async delete<T>(model: string, key: string, values, {
                    ifUseSelfData = false,
                  }: {
                    ifUseSelfData?: boolean
                  } = {},
  ): Promise<{ count: number }> {
    const publicData = this.defaultDelArg({ ifUseSelfData });
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

  private getSkipAndTakeFromPNS(pageNum: number, pageSize: number) {
    return {
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };
  }
}
