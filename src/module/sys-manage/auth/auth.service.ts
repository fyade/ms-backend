import { userDto } from '../user/dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { base } from '../../../util/base';
import { Injectable } from '@nestjs/common';
import { adminTopDto } from '../admin-top/dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {
  }

  async findUserByUsername(username: string): Promise<userDto> {
    const userDto = await this.prisma.findFirst<userDto>('sys_user', { username: username });
    return userDto;
  }

  async ifAdminUser(username: string) {
    const user = await this.prisma.findFirst<userDto>('sys_user', { username: username });
    if (await this.hasTopAdminPermission(user.id)) {
      return true;
    }
    const ps = await this.prisma.$queryRaw`
      SELECT 
          sur.id AS surId,
          sur.user_id AS userId,
          sur.role_id AS roleId,
          sur.remark AS surRemark,
          sur.create_by AS surCreateBy,
          sur.update_by AS surUpdateBy,
          sur.create_time AS surCreateTime,
          sur.update_time AS surUpdateTime,
          sur.deleted AS surDeleted,
          sr.id AS srId,
          sr.label AS label,
          sr.order_num AS orderNum,
          sr.remark AS srRemark,
          sr.create_by AS srCreateBy,
          sr.update_by AS srUpdateBy,
          sr.create_time AS srCreateTime,
          sr.update_time AS srUpdateTime,
          sr.deleted AS srDeleted,
          sr.if_admin AS ifAdmin,
          sr.if_disabled AS ifDisabled
      FROM
          sys_user_role sur
              LEFT JOIN
          sys_role sr ON sur.role_id = sr.id
      WHERE
          sur.deleted = ${base.N} AND sr.deleted = ${base.N}
              AND sr.if_disabled = ${base.N}
              AND sr.if_admin = ${base.Y}
              AND sur.user_id = ${user.id};
    `;
    return ps.length > 0;
  }

  async hasTopAdminPermission(userid: string) {
    const admintop = await this.prisma.findFirst('sys_admin_top', { userId: userid });
    return !!admintop;
  }

  async hasAdminPermissionByUsername(username: string, permission: string) {
    const user = await this.prisma.findFirst<userDto>('sys_user', { username: username });
    if (user) {
      return this.hasAdminPermissionByUser(user, permission);
    }
    return false;
  }

  async hasAdminPermissionByUserid(userid: string, permission: string) {
    const user = await this.prisma.findFirst<userDto>('sys_user', { id: userid });
    if (user) {
      return this.hasAdminPermissionByUser(user, permission);
    }
    return false;
  }

  async hasAdminPermissionByUser(user: userDto, permission: string) {
    if (await this.hasTopAdminPermission(user.id)) {
      return true
    }
    const permissionsOfUser = await this.permissionsOfUser(user, permission);
    const index = permissionsOfUser.findIndex(item => item.perms === permission);
    return index > -1;
  }

  async ifPublicInterface(permission: string) {
    const raw = await this.prisma.$queryRaw`
      select if_public
      from sys_menu
      where perms = ${permission}
        and if_public = ${base.Y};
    `;
    return raw.length > 0;
  }

  async permissionsOfUser(user: userDto, permission: string | null = null) {
    const retarr = [];
    if (user) {
      const userPermissions = await this.prisma.$queryRaw`
        SELECT 
            sm.id AS id,
            sm.label AS label,
            sm.path AS path,
            sm.parent_id AS parentId,
            sm.component AS component,
            sm.icon AS icon,
            sm.order_num AS orderNum,
            sm.if_link AS ifLink,
            sm.if_visible AS ifVisible,
            sm.if_disabled AS ifDisabled,
            sm.if_public AS ifPublic,
            sm.perms AS perms,
            sm.remark AS remark,
            sm.create_by AS createBy,
            sm.update_by AS updateBy,
            sm.create_time AS createTime,
            sm.update_time AS updateTime,
            sm.deleted AS deleted,
            sm.type AS type
        FROM
            sys_menu sm
        WHERE
            ((EXISTS( SELECT 
                    1
                FROM
                    sys_admin_top sat
                WHERE
                    sat.deleted = ${base.N}
                        AND sat.user_id = ${user.id})
                AND sm.deleted = ${base.N}
                AND sm.if_disabled = ${base.N})
                OR (NOT EXISTS( SELECT 
                    1
                FROM
                    sys_admin_top sat
                WHERE
                    sat.deleted = ${base.N}
                        AND sat.user_id = ${user.id})
                AND sm.id IN (SELECT 
                    sm.id
                FROM
                    sys_role_permission srp
                        LEFT JOIN
                    sys_user_role sur ON srp.role_id = sur.role_id
                        LEFT JOIN
                    sys_role sr ON sr.id = sur.role_id
                        LEFT JOIN
                    sys_menu sm ON srp.type = 'm'
                        AND srp.permission_id = sm.id
                WHERE
                    srp.deleted = ${base.N}
                        AND sur.deleted = ${base.N}
                        AND sm.deleted = ${base.N}
                        AND sm.if_disabled = ${base.N}
                        AND sr.deleted = ${base.N}
                        AND sr.if_disabled = ${base.N}
                        AND sur.user_id = ${user.id})))
                AND 1 = CASE
                WHEN
                    COALESCE(${permission}, '') <> ''
                THEN
                    CASE
                        WHEN perms = ${permission} THEN 1
                        ELSE 0
                    END
                ELSE 1
            END;
      `;
      retarr.push(...userPermissions);
    }
    return retarr;
  }

  async ifAdminUserUpdNotAdminUser(controlUserId: string, controledUserId: string) {
    const topAdminUser = await this.prisma.findAll<adminTopDto>('sys_admin_top', { data: { userId: { in: [controlUserId, controledUserId] } } }, false);
    return (controlUserId === controledUserId)
      || (topAdminUser.findIndex(item => item.userId === controlUserId) > -1 && topAdminUser.findIndex(item => item.userId === controledUserId) === -1);
  }
}
