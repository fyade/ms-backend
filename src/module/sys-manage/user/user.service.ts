import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { adminNewUserDto, loginDto, registDto, resetPsdDto, userDto, userListSelDto } from './dto';
import { genId } from '../../../util/IdUtils';
import { AuthService } from '../auth/auth.service';
import { HTTP } from '../../../common/Enum';
import { base } from '../../../util/base';
import { userRoleDto } from '../user-role/dto';
import { UserUnknownException } from '../../../exception/UserUnknownException';
import { adminTopDto } from '../admin-top/dto';
import { getCurrentUser } from '../../../util/baseContext';
import { UserPermissionDeniedException } from '../../../exception/UserPermissionDeniedException';
import { generateToken } from '../../../util/AuthUtils';
import { UserLoginService } from '../../sys-monitor/user-login/user-login.service';
import { comparePassword, hashPassword } from '../../../util/EncryptUtils';

@Injectable()
export class UserService {
  private maxLoginFailCount: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly logUserLoginService: UserLoginService,
  ) {
    this.maxLoginFailCount = 10;
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
    const topAdminUser = await this.prisma.findAll<adminTopDto>('sys_admin_top', { data: { userId: { in: res.list.map(item => item.id) } } }, false);
    const res2 = [];
    for (let i = 0; i < res.list.length; i++) {
      const roles = await this.prisma.findAll<userRoleDto>('sys_user_role', { data: { userId: res.list[i].id } });
      const roleids = roles.map(item => item.roleId);
      const rols = await this.prisma.findAll('sys_role', { data: { id: { in: roleids } }, orderBy: true }, false);
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
    const userid = genId(5, false);
    await this.prisma.create<userDto>('sys_user', {
      id: userid,
      username: dto.username,
      password: await hashPassword(dto.password),
      createBy: userid,
      updateBy: userid,
    });
    return R.ok('注册成功。');
  }

  async login(dto: loginDto): Promise<R> {
    let user;
    const user_ = await this.prisma.findFirst<userDto>('sys_user', {
      username: dto.username,
    });
    const b1 = await comparePassword(dto.password, user_.password);
    if (b1) {
      user = user_;
    }
    if (user) {
      delete user.password;
      const loginLog = await this.logUserLoginService.selAll({
        userId: user.id,
        ifSuccess: base.N,
      }, {
        orderBy: { createTime: 'desc' },
        range: {
          createTime: {
            gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
            lte: new Date(),
          },
        },
      });
      if (loginLog.data.length >= this.maxLoginFailCount) {
        const sort = loginLog.data.sort((a, b) => a.createTime - b.createTime);
        const number = Math.ceil(24 - (new Date().getTime() - new Date(sort[0].createTime).getTime()) / (1000 * 60 * 60));
        return R.err(`密码错误次数过多，请${number}小时后重试。`);
      }
      await this.logUserLoginService.insUserLogin({
        userId: user.id,
        ifSuccess: base.Y,
        remark: '登录成功',
      }, {
        ifCreateBy: false,
        ifUpdateBy: false,
        ifUpdateTime: false,
        ifDeleted: false,
      });
      const token = generateToken(user);
      return R.ok({
        token: token,
        user: user,
      });
    }
    const user2 = await this.prisma.findFirst<userDto>('sys_user', {
      username: dto.username,
    });
    if (user2) {
      await this.logUserLoginService.insUserLogin({
        userId: user2.id,
        ifSuccess: base.N,
        remark: '密码错误',
      }, {
        ifCreateBy: false,
        ifUpdateBy: false,
        ifUpdateTime: false,
        ifDeleted: false,
      });
      const loginLog = await this.logUserLoginService.selAll({
        userId: user2.id,
        ifSuccess: base.N,
      }, {
        orderBy: { createTime: 'desc' },
        range: {
          createTime: {
            gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
            lte: new Date(),
          },
        },
      });
      if (loginLog.data.length >= this.maxLoginFailCount) {
        const sort = loginLog.data.sort((a, b) => a.createTime - b.createTime);
        const number = Math.ceil(24 - (new Date().getTime() - new Date(sort[0].createTime).getTime()) / (1000 * 60 * 60));
        return R.err(`密码错误次数过多，请${number}小时后重试。`);
      }
      return R.err(`密码错误，还剩${this.maxLoginFailCount - loginLog.data.length}次机会。`);
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
    await this.prisma.create('sys_user', {
      ...dto,
      password: await hashPassword(dto.password),
      id: genId(5, false),
    }, { ifCustomizeId: true });
    return R.ok();
  }

  async resetPsd(dto: resetPsdDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(getCurrentUser().user.userid, dto.id)) {
      throw new UserPermissionDeniedException();
    }
    await this.prisma.updateById('sys_user', { ...dto, password: await hashPassword(dto.password) });
    return R.ok();
  }
}
