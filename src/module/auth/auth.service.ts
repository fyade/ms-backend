import { userDto } from '../sys-manage/user/dto';
import { PrismaService } from '../../prisma/prisma.service';
import { base } from '../../util/base';
import { Injectable } from '@nestjs/common';
import { adminTopDto } from '../admin-top/dto';
import { logAlgorithmCallDto } from '../sys-log/log-algorithm-call/dto';
import { getIpInfoFromRequest } from '../../util/RequestUtils';
import { userGroupPermissionDto } from '../sys-manage/user-group-permission/dto';
import { Exception } from '../../exception/Exception';
import { Request } from 'express';
import { interfaceDto } from '../sys-manage/interface/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  /**
   * 根据用户名查询用户
   * @param username
   */
  async findUserByUsername(username: string): Promise<userDto> {
    const userDto = await this.prisma.findFirst<userDto>('sys_user', { username: username });
    return userDto;
  }

  /**
   * 是否管理员用户
   * @param username
   */
  async ifAdminUser(username: string) {
    const user = await this.prisma.findFirst<userDto>('sys_user', { username: username });
    if (await this.hasTopAdminPermission(user.id)) {
      return true;
    }
    const ps1 = await this.prisma.$queryRaw`
      SELECT sur.id AS surId
      FROM sys_user_role sur
      WHERE sur.deleted = ${base.N}
        AND sur.user_id = ${user.id}
        and sur.role_id in
            (select sr.id
             from sys_role sr
             where sr.deleted = ${base.N}
               AND sr.if_disabled = ${base.N}
               AND sr.if_admin = ${base.Y});
    `;
    const ps2 = await this.prisma.$queryRaw`
      select sud.id as sudId
      from sys_user_dept sud
      where sud.deleted = ${base.N}
        and sud.user_id = ${user.id}
        and sud.dept_id in
            (select sd.id
             from sys_dept sd
             where sd.deleted = ${base.N}
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
   * 是否有某权限（根据用户名查询）
   * @param username
   * @param permission
   */
  async hasAdminPermissionByUsername(username: string, permission: string) {
    const user = await this.prisma.findFirst<userDto>('sys_user', { username: username });
    if (user) {
      return this.hasAdminPermissionByUser(user, permission);
    }
    return false;
  }

  /**
   * 是否有某权限（根据用户id查询）
   * @param userid
   * @param permission
   */
  async hasAdminPermissionByUserid(userid: string, permission: string) {
    const user = await this.prisma.findFirst<userDto>('sys_user', { id: userid });
    if (user) {
      return this.hasAdminPermissionByUser(user, permission);
    }
    return false;
  }

  /**
   * 是否有某权限（根据用户查询）
   * @param user
   * @param permission
   */
  async hasAdminPermissionByUser(user: userDto, permission: string) {
    if (await this.hasTopAdminPermission(user.id)) {
      return true;
    }
    const permissionsOfUser = await this.permissionsOfUser(user, permission);
    const index = permissionsOfUser.findIndex(item => item.perms === permission);
    return index > -1;
  }

  /**
   * 是否公共接口
   * @param permission
   */
  async ifPublicInterface(permission: string) {
    const raw = await this.prisma.$queryRaw`
      select if_public
      from sys_menu
      where perms = ${permission}
        and if_public = ${base.Y};
    `;
    return raw.length > 0;
  }

  /**
   * 用户的权限
   * @param user
   * @param permission
   */
  async permissionsOfUser(user: userDto, permission: string | null = null) {
    const retarr = [];
    if (user) {
      /**
       * 第三版
       */
      const userPermissions = await this.prisma.$queryRaw`
        select sm.id          AS id,
               sm.label       AS label,
               sm.path        AS path,
               sm.parent_id   AS parentId,
               sm.component   AS component,
               sm.icon        AS icon,
               sm.order_num   AS orderNum,
               sm.if_link     AS ifLink,
               sm.if_visible  AS ifVisible,
               sm.if_disabled AS ifDisabled,
               sm.if_public   AS ifPublic,
               sm.perms       AS perms,
               sm.remark      AS remark,
               sm.create_by   AS createBy,
               sm.update_by   AS updateBy,
               sm.create_time AS createTime,
               sm.update_time AS updateTime,
               sm.deleted     AS deleted,
               sm.type        AS type
        from sys_menu sm
        where deleted = ${base.N}
          and (
            if(exists
                   (select 1
                    from sys_admin_top sat
                    where sat.deleted = ${base.N}
                      and sat.user_id = ${user.id}),
               1 = 1,
               id in (select permission_id
                      from sys_role_permission
                      where deleted = ${base.N}
                        and type = 'm'
                        and role_id in
                            (select role_id
                             from sys_user_role
                             where deleted = ${base.N}
                               and user_id = ${user.id}
                               and role_id in
                                   (select id
                                    from sys_role
                                    where deleted = ${base.N}
                                      and if_admin = ${base.Y}
                                      and if_disabled = ${base.N})))
            )
                or id in
                   (select permission_id
                    from sys_dept_permission
                    where deleted = ${base.N}
                      and type = 'm'
                      and dept_id in
                          (select dept_id
                           from sys_user_dept
                           where deleted = ${base.N}
                             and user_id = ${user.id}))
            )
          and 1 = case
                      when coalesce(${permission}, '') <> ''
                          then
                          case
                              when perms = ${permission}
                                  then 1
                              else 0
                              end
                      else 1
            end;
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
    const topAdminUser = await this.prisma.findAll<adminTopDto>('sys_admin_top', {
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
    const algorithmCallDto = new logAlgorithmCallDto();
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
    const interf: interfaceDto[] = await this.prisma.$queryRaw`
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
      where deleted = ${base.N}
        and perms = ${permission};
    `;
    if (interf.length === 0) {
      throw new Exception('当前算法不存在。');
    }
    if (interf.length > 0) {
      // 是否公共算法
      if (interf[0].ifPublic === base.Y) {
        await this.prisma.$queryRaw`
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark)
        values (-1, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark});
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
    const userGroupPermission = permissions[0] as userGroupPermissionDto;
    algorithmCallDto.userGroupPermissionId = userGroupPermission.id;
    // 没长期权限，不在时间期限内，则阻止
    if (userGroupPermission.ifLongTerm === base.N) {
      if (new Date().getTime() < new Date(userGroupPermission.permissionStartTime).getTime() || new Date().getTime() > new Date(userGroupPermission.permissionEndTime).getTime()) {
        throw new Exception('您不在权限期限内。');
      }
    }
    // 在期限内，且不限制次数，则放行
    if (userGroupPermission.ifLimitRequestTimes === base.N) {
      await this.prisma.$queryRaw`
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark)
        values (${algorithmCallDto.userGroupPermissionId}, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark});
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
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark)
        values (${algorithmCallDto.userGroupPermissionId}, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark});
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
        insert into log_algorithm_call (user_group_permission_id, user_id, call_ip, if_success, remark)
        values (${algorithmCallDto.userGroupPermissionId}, ${algorithmCallDto.userId}, ${algorithmCallDto.callIp}, '?', ${algorithmCallDto.remark});
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
  async getSFPermissionsOfUserid(userid: string, permission: string, ifIgnoreUseUp = base.N): Promise<userGroupPermissionDto[]> {
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
}
