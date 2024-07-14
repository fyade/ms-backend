import { userDto } from '../sys-manage/user/dto';
import { PrismaService } from '../../prisma/prisma.service';
import { base } from '../../util/base';
import { Injectable } from '@nestjs/common';
import { adminTopDto } from '../admin-top/dto';

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
            id in (select permission_id
                   from sys_role_permission
                   where deleted = ${base.N}
                     and type = 'm'
                     and if(exists
                                (select 1
                                 from sys_admin_top sat
                                 where sat.deleted = ${base.N}
                                   and sat.user_id = ${user.id}),
                            1 = 1,
                            role_id in
                            (select role_id
                             from sys_user_role
                             where deleted = ${base.N}
                               and user_id = ${user.id}
                               and role_id in
                                   (select id
                                    from sys_role
                                    where deleted = ${base.N}
                                      and if_admin = ${base.Y}
                                      and if_disabled = ${base.N}))
                         ))
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
}
