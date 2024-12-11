import { PrismaService } from '../../prisma/prisma.service';
import { base, T_COMP, T_DEPT, T_HOST, T_Inter, T_IP, T_IS, T_MENU, T_ROLE } from '../../util/base';
import { Injectable } from '@nestjs/common';
import { AdminTopDto } from '../admin-top/dto';
import { LogAlgorithmCallDto } from '../module/algorithm/log-algorithm-call/dto';
import { getIpInfoFromRequest } from '../../util/RequestUtils';
import { UserGroupPermissionDto } from '../module/algorithm/user-group-permission/dto';
import { Exception } from '../../exception/Exception';
import { InterfaceDto } from '../module/algorithm/interface/dto';
import { timestamp } from '../../util/TimeUtils';
import { Request } from 'express';
import { MenuDto } from '../module/main/sys-manage/menu/dto';
import { MenuIpWhiteListDto } from '../module/main/sys-manage/menu-ip-white-list/dto';
import { BaseContextService } from '../base-context/base-context.service';
import { CachePermissionService } from '../cache/cache.permission.service';
import { UserTableDefaultPermissionDto } from '../module/main/other-user/user-table-default-permission/dto';
import { objToCamelCase } from '../../util/BaseUtils';
import { SysDto } from '../module/main/sys-manage/sys/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cachePermissionService: CachePermissionService,
    private readonly baseContextService: BaseContextService,
  ) {
  }

  /**
   * 是否管理员用户
   * @param userId
   * @param loginRole
   */
  async ifAdminUser(userId: string, loginRole: string) {
    if (await this.hasTopAdminPermission(userId)) {
      return true;
    }
    const { allRoleIds, allDeptIds } = await this.rolesAndDeptsOfUser(userId, loginRole);
    return allRoleIds.length > 0 || allDeptIds.length > 0;
  }

  /**
   * 是否超级管理员用户
   * @param userId
   */
  async hasTopAdminPermission(userId: string) {
    const admintop = await this.prisma.findFirst('sys_admin_top', { userId: userId });
    return !!admintop;
  }

  /**
   * 用户是否有某权限
   * @param userId
   * @param permission
   * @param loginRole
   */
  async hasAdminPermissionByUserid(userId: string, permission: string, loginRole: string) {
    const b = await this.cachePermissionService.ifHavePermissionInCache(userId, permission, loginRole);
    if (b) {
      return b === base.Y;
    }
    if (await this.hasTopAdminPermission(userId)) {
      return true;
    }
    const permissionsOfUser = await this.permissionsOfUser({ userId: userId, permission, loginRole });
    const index = permissionsOfUser.findIndex(item => item.perms === permission);
    await this.cachePermissionService.setPermissionInCache(userId, permission, loginRole, index > -1);
    return index > -1;
  }

  /**
   * 是否公共接口
   * @param permission
   */
  async ifPublicInterface(permission: string) {
    const ifPublicInterfaceInCache = await this.cachePermissionService.getIfPublicPermissionInCache(permission);
    if (ifPublicInterfaceInCache) {
      return ifPublicInterfaceInCache === base.Y;
    }
    const raw = await this.prisma.getOrigin().sys_menu.findMany({
      where: {
        perms: permission,
        if_public: base.Y,
        if_disabled: base.N,
        ...this.prisma.defaultSelArg().where,
      },
    });
    const b = raw.length > 0;
    await this.cachePermissionService.setPublicPermissionInCache(permission, b ? base.Y : base.N);
    return b;
  }

  /**
   * 请求源是否在接口的ip白名单中
   * @param permission
   * @param request
   */
  async ifIpInWhiteListOfPermission(permission: string, request: Request): Promise<boolean> {
    const menu: MenuDto[] = await this.prisma.$queryRaw`
      select id          as id,
             label       as label,
             type        as type,
             path        as path,
             parent_id   as parentId,
             component   as component,
             icon        as icon,
             order_num   as orderNum,
             if_link     as ifLink,
             if_visible  as ifVisible,
             if_disabled as ifDisabled,
             if_public   as ifPublic,
             perms       as perms,
             sys_id      as sysId,
             remark      as remark,
             create_by   as createBy,
             update_by   as updateBy,
             create_time as createTime,
             update_time as updateTime,
             deleted     as deleted
      from sys_menu
      where deleted = ${base.N}
        and if_disabled = ${base.N}
        and type = ${T_IS}
        and id =
            (select parent_id
             from sys_menu
             where deleted = ${base.N}
               and if_disabled = ${base.N}
               and type = ${T_Inter}
               and perms = ${permission});
    `;
    if (menu.length === 0) {
      return true;
    }
    const ips: MenuIpWhiteListDto[] = await this.prisma.$queryRaw`
      select id          as id,
             menu_id     as menuId,
             white_list  as whiteList,
             from_type   as fromType,
             type        as type,
             remark      as remark,
             create_by   as createBy,
             update_by   as updateBy,
             create_time as createTime,
             update_time as updateTime,
             deleted     as deleted
      from sys_menu_ip_white_list
      where deleted = ${base.N}
        and menu_id = ${menu[0].id}
        and type = ${T_IS};
    `;
    if (ips.length === 0) {
      return true;
    }
    const ipInfoFromRequest = getIpInfoFromRequest(request);
    const whiteList_ip = ips.filter(item => item.fromType === T_IP).map(item => item.whiteList);
    if (whiteList_ip.includes(ipInfoFromRequest.ip)) {
      return true;
    }
    if (ipInfoFromRequest.ip === '::1' && (whiteList_ip.includes('localhost') || whiteList_ip.includes('127.0.0.1'))) {
      return true;
    }
    const whiteList_host = ips.filter(item => item.fromType === T_HOST).map(item => item.whiteList);
    if (whiteList_host.includes(ipInfoFromRequest.host)) {
      return true;
    }
    return false;
  }

  /**
   * 用户的系统
   * @param userId
   * @param loginRole
   */
  async systemsOfUser(userId: string, loginRole: string) {
    const retarr = [];
    const sysPublicSelectParam = { if_disabled: base.N };
    const ifTopAdmin = await this.hasTopAdminPermission(userId);
    if (ifTopAdmin) {
      const userSyss_ = await this.prisma.getOrigin().sys_sys.findMany({
        where: {
          ...sysPublicSelectParam,
          ...this.prisma.defaultSelArg().where,
        },
        orderBy: {
          order_num: 'asc',
        },
      });
      const userSyss = objToCamelCase<SysDto[]>(userSyss_);
      retarr.push(...userSyss);
      return retarr;
    }
    const { allRoleIds, allDeptIds } = await this.rolesAndDeptsOfUser(userId, loginRole);
    const allSysIdsOfRole = await this.prisma.getOrigin().sys_role_sys.findMany({
      select: {
        sys_id: true,
      },
      where: {
        role_id: {
          in: allRoleIds,
        },
        ...this.prisma.defaultSelArg().where,
      },
    });
    const allSysIdsOfDept = await this.prisma.getOrigin().sys_dept_sys.findMany({
      select: {
        sys_id: true,
      },
      where: {
        dept_id: {
          in: allDeptIds,
        },
        ...this.prisma.defaultSelArg().where,
      },
    });
    const userSyss_ = await this.prisma.getOrigin().sys_sys.findMany({
      where: {
        id: {
          in: [
            ...allSysIdsOfRole.map(item => item.sys_id),
            ...allSysIdsOfDept.map(item => item.sys_id),
          ],
        },
        ...sysPublicSelectParam,
        ...this.prisma.defaultSelArg().where,
      },
      orderBy: {
        order_num: 'asc',
      },
    });
    const userSyss = objToCamelCase<SysDto[]>(userSyss_);
    retarr.push(...userSyss);
    return retarr;
  }

  /**
   * 用户的权限
   * @param userId
   * @param loginRole
   * @param permission
   * @param sysId
   * @param menuType
   */
  async permissionsOfUser({
                            userId,
                            loginRole,
                            permission,
                            sysId,
                            menuType = [T_MENU, T_COMP, T_IS, T_Inter],
                          }: {
                            userId: string
                            loginRole: string
                            permission?: string
                            sysId?: number
                            menuType?: string[]
                          },
  ) {
    const retarr = [];
    const menuPublicSelectParam = {
      type: {
        in: menuType,
      },
      ...(sysId ? { sys_id: Number(sysId) } : {}),
      ...(permission ? { perms: permission } : {}),
      if_disabled: base.N,
    };
    const ifTopAdmin = await this.hasTopAdminPermission(userId);
    if (ifTopAdmin) {
      const userPermissions_ = await this.prisma.getOrigin().sys_menu.findMany({
        where: {
          ...menuPublicSelectParam,
          ...this.prisma.defaultSelArg().where,
        },
        orderBy: {
          order_num: 'asc',
        },
      });
      const userPermissions = objToCamelCase<MenuDto[]>(userPermissions_);
      retarr.push(...userPermissions);
      return retarr;
    }
    const { allRoleIds, allDeptIds } = await this.rolesAndDeptsOfUser(userId, loginRole);
    const allPermissionIdsOfRole = await this.prisma.getOrigin().sys_role_permission.findMany({
      select: {
        permission_id: true,
      },
      where: {
        role_id: {
          in: allRoleIds,
        },
        ...this.prisma.defaultSelArg().where,
      },
    });
    const allPermissionIdsOfDept = await this.prisma.getOrigin().sys_dept_permission.findMany({
      select: {
        permission_id: true,
      },
      where: {
        dept_id: {
          in: allDeptIds,
        },
        ...this.prisma.defaultSelArg().where,
      },
    });
    const userPermissions_ = await this.prisma.getOrigin().sys_menu.findMany({
      where: {
        id: {
          in: [
            ...allPermissionIdsOfRole.map(item => item.permission_id),
            ...allPermissionIdsOfDept.map(item => item.permission_id),
          ],
        },
        ...menuPublicSelectParam,
        ...this.prisma.defaultSelArg().where,
      },
      orderBy: {
        order_num: 'asc',
      },
    });
    const userPermissions = objToCamelCase<MenuDto[]>(userPermissions_);
    retarr.push(...userPermissions);
    return retarr;
  }

  /**
   * 是否管理员用户操作非管理员用户
   * @param controlUserId
   * @param controledUserId
   */
  async ifAdminUserUpdNotAdminUser(controlUserId: string, controledUserId: string) {
    const topAdminUser = await this.prisma.findAll<AdminTopDto>('sys_admin_top', {
      data: {
        userId: {
          in: [controlUserId, controledUserId],
        },
      },
    });
    return (controlUserId === controledUserId)
      || (topAdminUser.findIndex(item => item.userId === controlUserId) > -1 && topAdminUser.findIndex(item => item.userId === controledUserId) === -1);
  }

  /**
   * 当前用户是否有此算法权限
   * @param userid
   * @param loginRole
   * @param permission
   * @param request
   */
  async hasSFPermissionByUserid(userid: string, loginRole: string, permission: string, request?: Request) {
    const algorithmCallDto = new LogAlgorithmCallDto();
    algorithmCallDto.userId = userid;
    algorithmCallDto.callIp = '';
    algorithmCallDto.ifSuccess = '?';
    if (request) {
      try {
        const ipInfoFromRequest = getIpInfoFromRequest(request);
        algorithmCallDto.callIp = ipInfoFromRequest.ip;
      } catch (e) {
        console.error(e);
      }
    }
    const interf: InterfaceDto[] = await this.prisma.$queryRaw`
      select si.id          as id,
             si.label       as label,
             si.icon        as icon,
             si.order_num   as orderNum,
             si.if_disabled as ifDisabled,
             si.if_public   as ifPublic,
             si.perms       as perms,
             si.url         as url,
             si.remark      as remark,
             si.create_by   as createBy,
             si.update_by   as updateBy,
             si.create_time as createTime,
             si.update_time as updateTime,
             si.deleted     as deleted
      from sys_interface si
      where si.deleted = ${base.N}
        and si.if_disabled = ${base.N}
        and si.perms = ${permission};
    `;
    if (interf.length === 0) {
      throw new Exception('当前算法不存在。');
    }
    if (interf.length > 0) {
      // 是否公共算法
      if (interf[0].ifPublic === base.Y) {
        await this.insLogAlgorithmCall(-1, permission, algorithmCallDto.userId, algorithmCallDto.callIp, '?', loginRole, algorithmCallDto.remark);
        return true;
      }
      // 是否禁用
      if (interf[0].ifDisabled === base.Y) {
        throw new Exception('当前算法被禁用。');
      }
    }
    const permissions = await this.getSFPermissionsOfUserid(userid, permission, loginRole);
    if (permissions.length === 0) {
      const permissions2 = await this.getSFPermissionsOfUserid(userid, permission, loginRole, base.Y);
      if (permissions2.length > 0) {
        throw new Exception('请求次数已使用完。');
      } else {
        return false;
      }
    }
    const userGroupPermission = permissions[0] as UserGroupPermissionDto;
    algorithmCallDto.userGroupPermissionId = userGroupPermission.id;
    // 没长期权限，不在时间期限内，则阻止
    if (userGroupPermission.ifLongTerm === base.N) {
      if (timestamp() < timestamp(userGroupPermission.permissionStartTime) || timestamp() > timestamp(userGroupPermission.permissionEndTime)) {
        throw new Exception('您不在权限期限内。');
      }
    }
    // 在期限内，且不限制次数，则放行
    if (userGroupPermission.ifLimitRequestTimes === base.N) {
      await this.insLogAlgorithmCall(algorithmCallDto.userGroupPermissionId, permission, algorithmCallDto.userId, algorithmCallDto.callIp, '?', loginRole, algorithmCallDto.remark);
      return true;
    }
    // 在时间期限内，次数还没用光，则放行
    const limitRequestTimes = userGroupPermission.limitRequestTimes;
    const count1: { count: number }[] = await this.prisma.$queryRaw`
      select count(id) as count
      from log_algorithm_call
      where user_group_permission_id = ${userGroupPermission.id};
    `;
    const count = count1[0].count;
    if (limitRequestTimes > count) {
      await this.insLogAlgorithmCall(algorithmCallDto.userGroupPermissionId, permission, algorithmCallDto.userId, algorithmCallDto.callIp, '?', loginRole, algorithmCallDto.remark);
      if (Number(count) === limitRequestTimes - 1) {
        if (userGroupPermission.ifRejectRequestUseUp === base.N) {
        } else {
          // 把状态更改为已用完
          await this.prisma.$queryRaw`
            update sys_user_group_permission
            set if_use_up = ${base.Y}
            where id = ${userGroupPermission.id};
          `;
        }
      }
      return true;
    }
    // 次数用光后是否停止服务
    if (userGroupPermission.ifRejectRequestUseUp === base.N) {
      await this.insLogAlgorithmCall(algorithmCallDto.userGroupPermissionId, permission, algorithmCallDto.userId, algorithmCallDto.callIp, '?', loginRole, algorithmCallDto.remark);
      return true;
    } else {
      // 把状态更改为已用完
      await this.prisma.$queryRaw`
        update sys_user_group_permission
        set if_use_up = ${base.Y}
        where id = ${userGroupPermission.id};
      `;
      throw new Exception('请求次数已使用完。');
    }
  }

  /**
   * 当前用户的算法权限列表
   * @param userid
   * @param permission
   * @param loginRole
   * @param ifIgnoreUseUp
   */
  async getSFPermissionsOfUserid(userid: string, permission: string, loginRole: string, ifIgnoreUseUp = base.N): Promise<UserGroupPermissionDto[]> {
    const userSFPermissions: UserGroupPermissionDto[] = await this.prisma.$queryRaw`
      select sugp.id                       as id,
             sugp.user_group_id            as userGroupId,
             sugp.permission_id            as permissionId,
             sugp.if_long_term             as ifLongTerm,
             sugp.if_limit_request_times   as ifLimitRequestTimes,
             sugp.if_reject_request_use_up as ifRejectRequestUseUp,
             sugp.permission_start_time    as permissionStartTime,
             sugp.permission_end_time      as permissionEndTime,
             sugp.limit_request_times      as limitRequestTimes,
             sugp.if_use_up                as ifUseUp,
             sugp.order_num                as orderNum,
             sugp.remark                   as remark,
             sugp.create_role              as createRole,
             sugp.update_role              as updateRole,
             sugp.create_by                as createBy,
             sugp.update_by                as updateBy,
             sugp.create_time              as createTime,
             sugp.update_time              as updateTime,
             sugp.deleted                  as deleted
      from sys_user_group_permission sugp
      where sugp.deleted = ${base.N}
        and sugp.if_use_up like ${ifIgnoreUseUp === base.Y ? '%%' : `%${base.N}%`}
        and sugp.user_group_id in
            (select suug.user_group_id
             from sys_user_user_group suug
             where suug.deleted = ${base.N}
               and suug.login_role = ${loginRole}
               and suug.user_id = ${userid})
        and sugp.permission_id in
            (select siig.interface_group_id
             from sys_interface_interface_group siig
             where siig.deleted = ${base.N}
               and siig.interface_id = (select si.id
                                        from sys_interface si
                                        where si.deleted = ${base.N}
                                          and si.perms = ${permission}))
      order by sugp.order_num;
    `;
    return userSFPermissions;
  }

  async rolesAndDeptsOfUser(userId: string, loginRole: string) {
    const allRoleIds1: { role_id: number }[] = await this.prisma.$queryRaw`
        select sur.role_id
        from sys_user_role sur
                 left join
             sys_role sr
             on sur.role_id = sr.id
        where sur.deleted = ${base.N}
          and sur.login_role = ${loginRole}
          and sur.user_id = ${userId}
          and sr.deleted = ${base.N}
          and sr.if_admin = ${base.Y}
          and sr.if_disabled = ${base.N}
        group by sur.role_id;
      `;
    const allDeptIds1: { dept_id: number }[] = await this.prisma.$queryRaw`
        select sud.dept_id
        from sys_user_dept sud
                 left join
             sys_dept sd
             on sud.dept_id = sd.id
        where sud.deleted = ${base.N}
          and sud.login_role = ${loginRole}
          and sud.user_id = ${userId}
          and sd.deleted = ${base.N}
          and sd.if_admin = ${base.Y}
          and sd.if_disabled = ${base.N}
        group by sud.dept_id;
      `;
    const allRoleIds = [...allRoleIds1.map(item => item.role_id)];
    const allDeptIds = [...allDeptIds1.map(item => item.dept_id)];
    if (loginRole === 'admin') {
      const sutdps_ = await this.prisma.getOrigin().sys_user_table_default_permission.findMany({
        where: {
          table_name: 'sys_user',
          ...this.prisma.defaultSelArg().where,
        },
      });
      const sutdps = objToCamelCase<UserTableDefaultPermissionDto[]>(sutdps_);
      const allRoleIds2 = await this.prisma.getOrigin().sys_role.findMany({
        where: {
          if_admin: base.Y,
          if_disabled: base.N,
          id: {
            in: sutdps.filter(item => item.permType === T_ROLE).map(item => item.permId),
          },
          ...this.prisma.defaultSelArg().where,
        },
      });
      const allDeptIds2 = await this.prisma.getOrigin().sys_dept.findMany({
        where: {
          if_admin: base.Y,
          if_disabled: base.N,
          id: {
            in: sutdps.filter(item => item.permType === T_DEPT).map(item => item.permId),
          },
          ...this.prisma.defaultSelArg().where,
        },
      });
      allRoleIds.push(...allRoleIds2.map(item => item.id));
      allDeptIds.push(...allDeptIds2.map(item => item.id));
    }
    if (loginRole === 'visitor') {
      const sutdps_ = await this.prisma.getOrigin().sys_user_table_default_permission.findMany({
        where: {
          table_name: 'sys_user_visitor',
          ...this.prisma.defaultSelArg().where,
        },
      });
      const sutdps = objToCamelCase<UserTableDefaultPermissionDto[]>(sutdps_);
      const allRoleIds2 = await this.prisma.getOrigin().sys_role.findMany({
        where: {
          if_admin: base.Y,
          if_disabled: base.N,
          id: {
            in: sutdps.filter(item => item.permType === T_ROLE).map(item => item.permId),
          },
          ...this.prisma.defaultSelArg().where,
        },
      });
      const allDeptIds2 = await this.prisma.getOrigin().sys_dept.findMany({
        where: {
          if_admin: base.Y,
          if_disabled: base.N,
          id: {
            in: sutdps.filter(item => item.permType === T_DEPT).map(item => item.permId),
          },
          ...this.prisma.defaultSelArg().where,
        },
      });
      allRoleIds.push(...allRoleIds2.map(item => item.id));
      allDeptIds.push(...allDeptIds2.map(item => item.id));
    }
    return {
      allRoleIds,
      allDeptIds,
    };
  }

  /**
   * 插入操作记录
   * @param permission
   * @param request
   * @param ifSuccess
   * @param remark
   * @param ifIgnoreParamInLog
   */
  async insLogOperation(permission: string, request: Request, ifSuccess: boolean | string, {
                          remark,
                          ifIgnoreParamInLog,
                        }: {
                          remark?: string
                          ifIgnoreParamInLog?: boolean
                        } = {
                          remark: '',
                          ifIgnoreParamInLog: false,
                        },
  ) {
    const userId = this.baseContextService.getUserData().userId || '???';
    const loginRole = this.baseContextService.getUserData().loginRole || '???';
    const ipInfoFromRequest = getIpInfoFromRequest(request);
    await this.prisma.getOrigin().log_operation.create({
      data: {
        req_id: this.baseContextService.getUserData().reqId,
        call_ip: ipInfoFromRequest.ip,
        host_name: ipInfoFromRequest.host,
        perms: permission,
        user_id: userId,
        req_param: ifIgnoreParamInLog ?
          JSON.stringify({ body: 'hidden', query: 'hidden' }) :
          JSON.stringify({ body: request.body, query: request.query }),
        old_value: '',
        operate_type: request.method,
        if_success: typeof ifSuccess === 'boolean' ? ifSuccess ? base.Y : base.N : ifSuccess,
        login_role: loginRole,
        remark: remark,
        create_time: new Date(timestamp()),
      },
    });
  }

  /**
   * 插入算法调用日志
   * @param userGroupPermissionId
   * @param perms
   * @param userId
   * @param callIp
   * @param ifSuccess
   * @param loginRole
   * @param remark
   */
  async insLogAlgorithmCall(userGroupPermissionId: number, perms: string, userId: string, callIp: string, ifSuccess: string, loginRole: string, remark: string) {
    await this.prisma.getOrigin().log_algorithm_call.create({
      data: {
        user_group_permission_id: userGroupPermissionId,
        perms: perms,
        user_id: userId,
        call_ip: callIp,
        if_success: ifSuccess,
        login_role: loginRole,
        remark: remark,
      },
    });
  }
}
