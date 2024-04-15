import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../../config/authConfig';
import { userDto } from '../user/dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { base } from '../../../util/base';
import { Injectable } from '@nestjs/common';

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

  async hasTopAdminPermission(userid: string, permission: string) {
    const admintop = await this.prisma.findFirst('sys_admin_top', { user_id: userid });
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
    console.log(permissionsOfUser, permission);
    return this.hasTopAdminPermission(user.id, permission);
  }

  async permissionsOfUser(user: userDto) {
    const retarr = [];
    if (user) {
      const userPermissions = await this.prisma.$queryRaw`
            select srp.type, srp.permission_id, sm.*
            from sys_role_permission srp
                     left join sys_user_role sur on srp.role_id = sur.role_id
                     left join sys_menu sm on srp.type = 'm' and srp.permission_id = sm.id
            where srp.deleted = 'N'
              and sur.deleted = 'N'
              and sm.deleted = 'N'
              and sur.user_id = ${user.id}
      `;
      retarr.push(...userPermissions);
    }
    return retarr;
  }
}
