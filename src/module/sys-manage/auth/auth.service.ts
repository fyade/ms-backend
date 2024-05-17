import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../../config/authConfig';
import { userDto } from '../user/dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { base } from '../../../util/base';
import { Injectable } from '@nestjs/common';
import { roleDto } from '../role/dto';
import { adminTopDto } from '../admin-top/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
  }

  async generateToken(user: userDto): Promise<any> {
    const payload = { username: user.username, userid: user.id };
    return this.jwtService.sign(payload, { secret: jwtConstants.secret });
  }

  async verifyToken(token: string): Promise<any> {
    const verify = this.jwtService.verify(token, { secret: jwtConstants.secret });
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
            select sur.id          as surId,
                   sur.user_id     as userId,
                   sur.role_id     as roleId,
                   sur.remark      as surRemark,
                   sur.create_by   as surCreateBy,
                   sur.update_by   as surUpdateBy,
                   sur.create_time as surCreateTime,
                   sur.update_time as surUpdateTime,
                   sur.deleted     as surDeleted,
                   sr.id           as srId,
                   sr.label        as label,
                   sr.order_num    as orderNum,
                   sr.remark       as srRemark,
                   sr.create_by    as srCreateBy,
                   sr.update_by    as srUpdateBy,
                   sr.create_time  as srCreateTime,
                   sr.update_time  as srUpdateTime,
                   sr.deleted      as srDeleted,
                   sr.if_admin     as ifAdmin,
                   sr.if_disabled  as ifDisabled
            from sys_user_role sur
                     left join sys_role sr on sur.role_id = sr.id
            where sur.deleted = ${base.N}
              and sr.deleted = ${base.N}
              and sr.if_disabled = ${base.N}
              and sr.if_admin = ${base.Y}
              and sur.user_id = ${user.id};
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
    const permissionsOfUser = await this.permissionsOfUser(user);
    const index = permissionsOfUser.findIndex(item => item.perms === permission);
    return await this.hasTopAdminPermission(user.id) || index > -1;
  }

  async permissionsOfUser(user: userDto) {
    const retarr = [];
    if (user) {
      const userPermissions = await this.prisma.$queryRaw`
            select sm.id          as id,
                   sm.label       as label,
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
                   sm.deleted     as deleted,
                   sm.type        as type
            from sys_menu sm
            where (
                exists(select 1 from sys_admin_top sat where sat.deleted = ${base.N} and sat.user_id = ${user.id})
                    and sm.deleted = ${base.N}
                    and sm.if_disabled = ${base.N}
                )
               or (
                not exists(select 1 from sys_admin_top sat where sat.deleted = ${base.N} and sat.user_id = ${user.id})
                    and sm.id in (select sm.id
                                  from sys_role_permission srp
                                           left join sys_user_role sur on srp.role_id = sur.role_id
                                           left join sys_role sr on sr.id = sur.role_id
                                           left join sys_menu sm on srp.type = 'm' and srp.permission_id = sm.id
                                  where srp.deleted = ${base.N}
                                    and sur.deleted = ${base.N}
                                    and sm.deleted = ${base.N}
                                    and sm.if_disabled = ${base.N}
                                    and sr.deleted = ${base.N}
                                    and sr.if_disabled = ${base.N}
                                    and sur.user_id = ${user.id})
                );
      `;
      retarr.push(...userPermissions);
    }
    return retarr;
  }

  async ifAdminUserUpdNotAdminUser(controlUserId: string, controledUserId: string) {
    const topAdminUser = await this.prisma.findAll<adminTopDto>('sys_admin_top', { userId: { in: [controlUserId, controledUserId] } });
    return (controlUserId === controledUserId)
      || (topAdminUser.findIndex(item => item.userId === controlUserId) > -1 && topAdminUser.findIndex(item => item.userId === controledUserId) === -1);
  }
}
