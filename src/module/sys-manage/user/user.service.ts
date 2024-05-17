import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { adminNewUserDto, loginDto, registDto, resetPsdDto, userDto, userListSelDto } from './dto';
import { genid } from '../../../util/IdUtils';
import { AuthService } from '../auth/auth.service';
import { HTTP } from '../../../common/Enum';
import { base } from '../../../util/base';
import { userRoleDto } from '../user-role/dto';
import { UserUnknownException } from '../../../exception/UserUnknownException';
import { adminTopDto } from '../admin-top/dto';
import { getCurrentUser } from '../../../util/baseContext';
import { UserPermissionDeniedException } from '../../../exception/UserPermissionDeniedException';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
  }

  async userSelList(dto: userListSelDto): Promise<R> {
    const ifWithRole = dto.ifWithRole;
    delete dto.ifWithRole;
    const res = await this.prisma.findPage<userDto, userListSelDto>('sys_user', {
      data: dto,
      notNullKeys: ['username'],
    });
    res.list = res.list.map(item => ({ ...item, password: null }));
    if (ifWithRole === base.N) {
      return R.ok(res);
    }
    const topAdminUser = await this.prisma.findAll<adminTopDto>('sys_admin_top', { userId: { in: res.list.map(item => item.id) } });
    const res2 = [];
    for (let i = 0; i < res.list.length; i++) {
      const roles = await this.prisma.findAll<userRoleDto>('sys_user_role', { userId: res.list[i].id });
      const roleids = roles.map(item => item.roleId);
      const rols = await this.prisma.findAll('sys_role', { id: { in: roleids } }, true);
      res2.push({
        ...res.list[i],
        roles: rols,
        ifTopAdmin: topAdminUser.findIndex(item => item.userId === res.list[i].id) > -1,
      });
    }
    return R.ok({
      ...res,
      list: res2,
    });
  }

  async regist(dto: registDto): Promise<R> {
    const user = await this.authService.findUserByUsername(dto.username);
    if (user) {
      return R.err('用户名已被使用。');
    }
    const userid = genid(5, false);
    await this.prisma.create<userDto>('sys_user', {
      id: userid,
      username: dto.username,
      password: dto.password,
      createBy: userid,
      updateBy: userid,
    });
    return R.ok('注册成功。');
  }

  async login(dto: loginDto): Promise<R> {
    const user = await this.prisma.findFirst<userDto>('sys_user', {
      username: dto.username,
      password: dto.password,
    });
    if (user) {
      const token = await this.authService.generateToken(user);
      delete user.password;
      return R.ok({
        token: token,
        user: user,
      });
    }
    const user2 = await this.prisma.findFirst<userDto>('sys_user', {
      username: dto.username,
    });
    if (user2) {
      return R.err('密码错误。');
    } else {
      throw new UserUnknownException();
    }
  }

  async adminlogin(dto: loginDto): Promise<R> {
    const userinfo = await this.login(dto);
    if (userinfo.code !== HTTP.SUCCESS().code) {
      return R.err(userinfo.msg);
    }
    const permissions = await this.authService.permissionsOfUser(userinfo.data.user);
    return R.ok({ ...userinfo.data, permissions });
  }

  async insUser(dto: adminNewUserDto): Promise<R> {
    const user = await this.prisma.findFirst('sys_user', { username: dto.username });
    if (user) {
      return R.err('用户名已存在。');
    }
    await this.prisma.create('sys_user', { ...dto, id: genid(5, false) }, { ifCustomizeId: true });
    return R.ok();
  }

  async resetPsd(dto: resetPsdDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.id)) {
      throw new UserPermissionDeniedException();
    }
    const res = await this.prisma.updateById('sys_user', dto);
    return R.ok();
  }
}