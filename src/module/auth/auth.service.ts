import { UserDto } from '../module/main/sys-manage/user/dto';
import { PrismaService } from '../../prisma/prisma.service';
import { base, T_COMP, T_HOST, T_Inter, T_IP, T_IS, T_MENU } from '../../util/base';
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
   * @param userid
   */
  async ifAdminUser(userid: string) {
    if (await this.hasTopAdminPermission(userid)) {
      return true;
    }
    const ps1 = await this.prisma.$queryRaw`
      select sur.id as surId
      from sys_user_role sur
      where sur.deleted = ${base.N}
        and sur.user_id = ${userid}
        and sur.role_id in
            (select sr.id
             from sys_role sr
             where sr.deleted = ${base.N}
               and sr.if_disabled = ${base.N}
               and sr.if_admin = ${base.Y});
    `;
    const ps2 = await this.prisma.$queryRaw`
      select sud.id as sudId
      from sys_user_dept sud
      where sud.deleted = ${base.N}
        and sud.user_id = ${userid}
        and sud.dept_id in
            (select sd.id
             from sys_dept sd
             where sd.deleted = ${base.N}
               and sd.if_disabled = ${base.N}
               and sd.if_admin = ${base.Y});
    `;
    const ps = [...ps1, ...ps2];
    return ps.length > 0;
  }

  /**
   * 是否超级管理员用户
   * @param userid
   */
  async hasTopAdminPermission(userid: string) {
    const admintop = await this.prisma.findFirst('sys_admin_top', { userId: userid });
    return !!admintop;
  }

  /**
   * 是否有某权限（根据用户id查询）
   * @param userid
   * @param permission
   */
  async hasAdminPermissionByUserid(userid: string, permission: string) {
    const b = await this.cachePermissionService.ifHavePermissionInCache(userid, permission);
    if (b) {
      return b === base.Y;
    }
    if (await this.hasTopAdminPermission(userid)) {
      return true;
    }
    const permissionsOfUser = await this.permissionsOfUser({ userId: userid, permission });
    const index = permissionsOfUser.findIndex(item => item.perms === permission);
    await this.cachePermissionService.setPermissionInCache(userid, permission, index > -1);
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
    const raw = await this.prisma.$queryRaw`
      select if_public
      from sys_menu
      where perms = ${permission}
        and if_public = ${base.Y};
    `;
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
   */
  async systemsOfUser(userId: string) {
    const retarr = [];
    if (userId) {
      const userSystems = await this.prisma.$queryRaw`
        select ss.id          as id,
               ss.name        as name,
               ss.perms       as perms,
               ss.order_num   as orderNum,
               ss.path        as path,
               ss.if_disabled as ifDisabled,
               ss.remark      as remark,
               ss.create_by   as createBy,
               ss.update_by   as updateBy,
               ss.create_time as createTime,
               ss.update_time as updateTime,
               ss.deleted     as deleted
        from sys_sys ss
        where ss.deleted = ${base.N}
          and ss.if_disabled = ${base.N}
          and (
            if(exists
                   (select 1
                    from sys_admin_top sat
                    where sat.deleted = ${base.N}
                      and sat.user_id = ${userId}),
               1 = 1,
               (
                   ss.id in (select srs.sys_id
                             from sys_role_sys srs
                             where srs.deleted = ${base.N}
                               and srs.role_id in
                                   (select sur.role_id
                                    from sys_user_role sur
                                    where sur.deleted = ${base.N}
                                      and sur.user_id = ${userId}
                                      and sur.role_id in
                                          (select sr.id
                                           from sys_role sr
                                           where sr.deleted = ${base.N}
                                             and sr.if_admin = ${base.Y}
                                             and sr.if_disabled = ${base.N})))
                       or ss.id in (select sds.sys_id
                                    from sys_dept_sys sds
                                    where sds.deleted = ${base.N}
                                      and sds.dept_id in
                                          (select sud.dept_id
                                           from sys_user_dept sud
                                           where sud.deleted = ${base.N}
                                             and sud.user_id = ${userId}
                                             and sud.dept_id in
                                                 (select sd.id
                                                  from sys_dept sd
                                                  where sd.deleted = ${base.N}
                                                    and sd.if_disabled = ${base.N}
                                                    and sd.if_admin = ${base.Y})))
                   )
            ))
        order by ss.order_num;
      `;
      retarr.push(...userSystems);
    }
    return retarr;
  }

  /**
   * 用户的权限
   * @param userId
   * @param permission
   * @param sysId
   * @param menuType
   */
  async permissionsOfUser({
                            userId,
                            permission,
                            sysId,
                            menuType = [T_MENU, T_COMP, T_IS, T_Inter],
                          }: {
                            userId: string
                            permission?: string
                            sysId?: number
                            menuType?: string[]
                          },
  ) {
    const retarr = [];
    if (userId) {
      /**
       * 第三版
       */
      const userPermissions = await this.prisma.$queryRaw`
        select sm.id          as id,
               sm.label       as label,
               sm.type        as type,
               sm.path        as path,
               sm.parent_id   as parentId,
               sm.component   as component,
               sm.icon        as icon,
               sm.order_num   as orderNum,
               sm.if_link     as ifLink,
               sm.if_visible  as ifVisible,
               sm.if_disabled as ifDisabled,
               sm.if_public   as ifPublic,
               sm.perms       as perms,
               sm.remark      as remark,
               sm.create_by   as createBy,
               sm.update_by   as updateBy,
               sm.create_time as createTime,
               sm.update_time as updateTime,
               sm.deleted     as deleted
        from sys_menu sm
        where sm.deleted = ${base.N}
          and locate(sm.type, ${`-${menuType.join('-')}-`}) > 0
          and (
            if(exists
                   (select 1
                    from sys_admin_top sat
                    where sat.deleted = ${base.N}
                      and sat.user_id = ${userId}),
               1 = 1,
               (sm.id in
                (select permission_id
                 from sys_role_permission srp
                 where srp.deleted = ${base.N}
                   and srp.type = 'm'
                   and srp.role_id in
                       (select role_id
                        from sys_user_role sur
                        where sur.deleted = ${base.N}
                          and sur.user_id = ${userId}
                          and sur.role_id in
                              (select id
                               from sys_role sr
                               where sr.deleted = ${base.N}
                                 and sr.if_admin = ${base.Y}
                                 and sr.if_disabled = ${base.N})))
                   or sm.id in
                      (select permission_id
                       from sys_dept_permission sdp
                       where sdp.deleted = ${base.N}
                         and sdp.type = 'm'
                         and sdp.dept_id in
                             (select dept_id
                              from sys_user_dept sud
                              where sud.deleted = ${base.N}
                                and sud.user_id = ${userId}))
                   )))
          and 1 = case
                      when coalesce(${permission}, '') <> ''
                          then
                          case
                              when sm.perms = ${permission}
                                  then 1
                              else 0
                              end
                      else 1
            end
          and 1 = case
                      when coalesce(${sysId}, '') <> ''
                          then
                          case
                              when sm.sys_id = ${sysId}
                                  then 1
                              else 0
                              end
                      else 1
            end
        order by sm.order_num;
      `;
      retarr.push(...userPermissions);
    }
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
    }, false);
    return (controlUserId === controledUserId)
      || (topAdminUser.findIndex(item => item.userId === controlUserId) > -1 && topAdminUser.findIndex(item => item.userId === controledUserId) === -1);
  }

  /**
   * 当前用户是否有此算法权限
   * @param userid
   * @param permission
   * @param request
   */
  async hasSFPermissionByUserid(userid: string, permission: string, request?: Request) {
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
        and si.perms = ${permission};
    `;
    if (interf.length === 0) {
      throw new Exception('当前算法不存在。');
    }
    if (interf.length > 0) {
      // 是否公共算法
      if (interf[0].ifPublic === base.Y) {
        await this.prisma.$queryRaw`
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark, create_time)
        values (-1, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark}, ${new Date(timestamp())});
      `;
        return true;
      }
      // 是否禁用
      if (interf[0].ifDisabled === base.Y) {
        throw new Exception('当前算法被禁用。');
      }
    }
    const permissions = await this.getSFPermissionsOfUserid(userid, permission);
    if (permissions.length === 0) {
      const permissions2 = await this.getSFPermissionsOfUserid(userid, permission, base.Y);
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
      await this.prisma.$queryRaw`
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark, create_time)
        values (${algorithmCallDto.userGroupPermissionId}, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark}, ${new Date(timestamp())});
      `;
      return true;
    }
    // 在时间期限内，次数还没用光，则放行
    const limitRequestTimes = userGroupPermission.limitRequestTimes;
    const count1 = await this.prisma.$queryRaw`
      select count(id) as count
      from log_algorithm_call
      where user_group_permission_id = ${userGroupPermission.id};
    `;
    const count = count1[0].count;
    if (limitRequestTimes > count) {
      await this.prisma.$queryRaw`
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark, create_time)
        values (${algorithmCallDto.userGroupPermissionId}, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark}, ${new Date(timestamp())});
      `;
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
      await this.prisma.$queryRaw`
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark, create_time)
        values (${algorithmCallDto.userGroupPermissionId}, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark}, ${new Date(timestamp())});
      `;
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
   * @param ifIgnoreUseUp
   */
  async getSFPermissionsOfUserid(userid: string, permission: string, ifIgnoreUseUp = base.N): Promise<UserGroupPermissionDto[]> {
    const userSFPermissions = await this.prisma.$queryRaw`
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
    const user = this.baseContextService.getUserData().user;
    const ipInfoFromRequest = getIpInfoFromRequest(request);
    await this.prisma.getOrigin().log_operation.create({
      data: {
        req_id: this.baseContextService.getUserData().reqId,
        call_ip: ipInfoFromRequest.ip,
        host_name: ipInfoFromRequest.host,
        perms: permission,
        user_id: user ? user.userid : '???',
        req_param: ifIgnoreParamInLog ?
          JSON.stringify({ body: 'hidden', query: 'hidden' }) :
          JSON.stringify({ body: request.body, query: request.query }),
        old_value: '',
        operate_type: request.method,
        if_success: typeof ifSuccess === 'boolean' ? ifSuccess ? base.Y : base.N : ifSuccess,
        remark: remark,
        create_time: new Date(timestamp()),
      },
    });
  }
}
