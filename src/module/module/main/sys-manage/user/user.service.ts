import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { AdminNewUserDto, LoginDto, RegistDto, ResetUserPsdDto, UpdPsdDto, UserDto, UserSelListDto } from './dto';
import { genId } from '../../../../../util/IdUtils';
import { AuthService } from '../../../../auth/auth.service';
import { HTTP } from '../../../../../common/Enum';
import { base } from '../../../../../util/base';
import { UserRoleDto } from '../user-role/dto';
import { UserUnknownException } from '../../../../../exception/UserUnknownException';
import { AdminTopDto } from '../../../../admin-top/dto';
import { UserPermissionDeniedException } from '../../../../../exception/UserPermissionDeniedException';
import { LogUserLoginService } from '../../sys-log/log-user-login/log-user-login.service';
import { comparePassword, hashPassword } from '../../../../../util/EncryptUtils';
import { UserDeptDto } from '../user-dept/dto';
import { UserGroupDto } from '../../../algorithm/user-group/dto';
import { UserUserGroupDto } from '../../../algorithm/user-user-group/dto';
import { RoleDto } from '../role/dto';
import { DeptDto } from '../dept/dto';
import { CacheTokenService } from '../../../../cache/cache.token.service';
import { timestamp } from '../../../../../util/TimeUtils';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { LogUserLoginDto, NOT_ADMIN, PASSWORD_ERROR } from '../../sys-log/log-user-login/dto';
import { UserVisitorDto } from '../../other-user/user-visitor/dto';

@Injectable()
export class UserService {
  private maxLoginFailCount: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly logUserLoginService: LogUserLoginService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly baseContextService: BaseContextService,
  ) {
    this.maxLoginFailCount = 10;
  }

  async selUser(dto: UserSelListDto): Promise<R> {
    const ifWithRole = dto.ifWithRole;
    delete dto.ifWithRole;
    const res = await this.prisma.findPage<UserDto, UserSelListDto>('sys_user', {
      data: dto,
      orderBy: false,
      notNullKeys: ['id', 'username'],
      numberKeys: [],
      completeMatchingKeys: [],
    });
    res.list.forEach(item => {
      delete item.password;
    });
    if (ifWithRole !== base.Y) {
      return R.ok(res);
    }
    const topAdminUser = await this.prisma.findAll<AdminTopDto>('sys_admin_top', {
      data: {
        userId: {
          in: res.list.map(item => item.id),
        },
      },
    });
    const res2 = [];
    const userIds = res.list.map(item => item.id);
    const allUserRolesOfThoseUsers = await this.prisma.findAll<UserRoleDto>('sys_user_role', {
      data: {
        userId: {
          in: userIds,
        },
        login_role: 'admin',
      },
    });
    const allRoleIdsOfThoseUsers = allUserRolesOfThoseUsers.map(item => item.roleId);
    const allRolesOfThoseUsers = await this.prisma.findAll<RoleDto>('sys_role', {
      data: {
        id: {
          in: allRoleIdsOfThoseUsers,
        },
      },
    });
    const allUserDeptsOfThoseUsers = await this.prisma.findAll<UserDeptDto>('sys_user_dept', {
      data: {
        userId: {
          in: userIds,
        },
        login_role: 'admin',
      },
    });
    const allUserDeptIdsOfThoseUsers = allUserDeptsOfThoseUsers.map(item => item.deptId);
    const allDeptsOfThoseUsers = await this.prisma.findAll<DeptDto>('sys_dept', {
      data: {
        id: {
          in: allUserDeptIdsOfThoseUsers,
        },
      },
    });
    const allUserUserGroupsOfThoseUsers = await this.prisma.findAll<UserUserGroupDto>('sys_user_user_group', {
      data: {
        userId: {
          in: userIds,
        },
        login_role: 'admin',
      },
    });
    const allUserUserGroupIdsOfThoseUsers = allUserUserGroupsOfThoseUsers.map(item => item.userGroupId);
    const allUserGroupsOfThoseUsers = await this.prisma.findAll<UserGroupDto>('sys_user_group', {
      data: {
        id: {
          in: allUserUserGroupIdsOfThoseUsers,
        },
      },
    });
    for (let i = 0; i < res.list.length; i++) {
      const roleIdsOfThisUser = allUserRolesOfThoseUsers.filter(item => item.userId === res.list[i].id).map(item => item.roleId);
      const rolesOfThisUser = allRolesOfThoseUsers.filter(item => roleIdsOfThisUser.indexOf(item.id) > -1);
      const deptIdsOfThisUser = allUserDeptsOfThoseUsers.filter(item => item.userId === res.list[i].id).map(item => item.deptId);
      const deptsOfThisUser = allDeptsOfThoseUsers.filter(item => deptIdsOfThisUser.indexOf(item.id) > -1);
      const ugIdsOfThisUser = allUserUserGroupsOfThoseUsers.filter(item => item.userId === res.list[i].id).map(item => item.userGroupId);
      const ugsOfThisUser = allUserGroupsOfThoseUsers.filter(item => ugIdsOfThisUser.indexOf(item.id) > -1);
      res2.push({
        ...res.list[i],
        roles: rolesOfThisUser,
        depts: deptsOfThisUser,
        ugs: ugsOfThisUser,
        ifTopAdmin: topAdminUser.findIndex(item => item.userId === res.list[i].id) > -1,
      });
    }
    return R.ok({
      ...res,
      list: res2,
    });
  }

  async getSelfInfo(): Promise<R> {
    const user = await this.prisma.findById<UserDto>('sys_user', this.baseContextService.getUserData().userId);
    delete user.password;
    return R.ok(user);
  }

  async selOnesUser(ids: string[]): Promise<R> {
    const res = await this.prisma.findByIds<UserDto>('sys_user', Object.values(ids));
    res.forEach(item => {
      delete item.password;
    });
    return R.ok(res);
  }

  async insUser(dto: AdminNewUserDto): Promise<R> {
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

  async updUser(dto: UserDto): Promise<R> {
    await this.prisma.updateById('sys_user', dto);
    return R.ok();
  }

  async updPsd(dto: UpdPsdDto): Promise<R> {
    const user_ = await this.prisma.findById<UserDto>('sys_user', this.baseContextService.getUserData().userId);
    const ifUserYes = await comparePassword(dto.oldp, user_.password);
    if (!ifUserYes) {
      return R.err('旧密码错误。');
    }
    await this.prisma.updateById('sys_user', {
      id: user_.id,
      password: await hashPassword(dto.newp1),
    });
    return R.ok();
  }

  async adminResetUserPsd(dto: ResetUserPsdDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(this.baseContextService.getUserData().userId, dto.id)) {
      throw new UserPermissionDeniedException();
    }
    await this.prisma.updateById('sys_user', { ...dto, password: await hashPassword(dto.password) });
    return R.ok();
  }

  async regist(dto: RegistDto): Promise<R> {
    if (dto.loginRole === 'admin') {
      const user = await this.prisma.findFirst<UserDto>('sys_user', {
        username: dto.username,
      });
      if (user) {
        return R.err('用户名已被使用。');
      }
      const userid = genId(5, false);
      await this.prisma.create<UserDto>('sys_user', {
        id: userid,
        username: dto.username,
        password: await hashPassword(dto.password),
        createRole: dto.loginRole,
        updateRole: dto.loginRole,
        createBy: userid,
        updateBy: userid,
      }, { ifCustomizeId: true });
      return R.ok('注册成功。');
    }
    if (dto.loginRole === 'visitor') {
      const user = await this.prisma.findFirst<UserVisitorDto>('sys_user_visitor', {
        username: dto.username,
      });
      if (user) {
        return R.err('用户名已被使用。');
      }
      const userid = genId(10, false);
      await this.prisma.create<UserVisitorDto>('sys_user_visitor', {
        id: userid,
        username: dto.username,
        password: await hashPassword(dto.password),
        createRole: dto.loginRole,
        updateRole: dto.loginRole,
        createBy: userid,
        updateBy: userid,
      }, { ifCustomizeId: true });
      return R.ok('注册成功。');
    }
  }

  async login(dto: LoginDto, { loginIp, loginBrowser, loginOs }, ifAdminLogin = false): Promise<R<{
    token: string,
    user: UserDto
  }>> {
    if (dto.loginRole === 'admin') {
      const user = await this.prisma.findFirst<UserDto>('sys_user', {
        username: dto.username,
      });
      if (!user) {
        throw new UserUnknownException();
      }
      const loginlogs = await this.getLoginLogsOfPasswordError(user.id, loginIp, dto.loginRole);
      if (loginlogs.length >= this.maxLoginFailCount) {
        const sort = loginlogs.sort((a, b) => timestamp(a.createTime) - timestamp(b.createTime));
        const number = Math.ceil(24 - (timestamp() - timestamp(sort[0].createTime)) / (1000 * 60 * 60));
        return R.err(`您的账号在当前IP密码错误次数过多，请${number}小时后重试或更换网络环境重试。`);
      }
      const b1 = await comparePassword(dto.password, user.password);
      if (!b1) {
        await this.insLoginLog(loginIp, loginBrowser, '', loginOs, user.id, dto.loginRole, b1, PASSWORD_ERROR);
        return R.err(`密码错误，还剩${this.maxLoginFailCount - loginlogs.length - 1}次机会。`);
      }
      if (!ifAdminLogin) {
        await this.insLoginLog(loginIp, loginBrowser, '', loginOs, user.id, dto.loginRole, b1);
      }
      delete user.password;
      const token = await this.cacheTokenService.genToken(user.id, user.username, dto.loginRole);
      return R.ok({
        token: token,
        user: user,
      });
    }
    if (dto.loginRole === 'visitor') {
      const user = await this.prisma.findFirst<UserVisitorDto>('sys_user_visitor', {
        username: dto.username,
      });
      if (!user) {
        throw new UserUnknownException();
      }
      const loginlogs = await this.getLoginLogsOfPasswordError(user.id, loginIp, dto.loginRole);
      if (loginlogs.length >= this.maxLoginFailCount) {
        const sort = loginlogs.sort((a, b) => timestamp(a.createTime) - timestamp(b.createTime));
        const number = Math.ceil(24 - (timestamp() - timestamp(sort[0].createTime)) / (1000 * 60 * 60));
        return R.err(`您的账号在当前IP密码错误次数过多，请${number}小时后重试或更换网络环境重试。`);
      }
      const b1 = await comparePassword(dto.password, user.password);
      if (!b1) {
        await this.insLoginLog(loginIp, loginBrowser, '', loginOs, user.id, dto.loginRole, b1, PASSWORD_ERROR);
        return R.err(`密码错误，还剩${this.maxLoginFailCount - loginlogs.length - 1}次机会。`);
      }
      if (!ifAdminLogin) {
        await this.insLoginLog(loginIp, loginBrowser, '', loginOs, user.id, dto.loginRole, b1);
      }
      delete user.password;
      const token = await this.cacheTokenService.genToken(user.id, user.username, dto.loginRole);
      return R.ok({
        token: token,
        user: user,
      });
    }
  }

  async adminlogin(dto: LoginDto, { loginIp, loginBrowser, loginOs }): Promise<R> {
    const userinfo = await this.login(dto, { loginIp, loginBrowser, loginOs }, true);
    if (userinfo.code !== HTTP.SUCCESS().code) {
      return R.err(userinfo.msg);
    }
    const ifAdminUser = await this.authService.ifAdminUser(userinfo.data.user.id, dto.loginRole);
    if (ifAdminUser) {
      await this.insLoginLog(loginIp, loginBrowser, '', loginOs, userinfo.data.user.id, dto.loginRole, true);
      return R.ok(userinfo.data);
    } else {
      await this.insLoginLog(loginIp, loginBrowser, '', loginOs, userinfo.data.user.id, dto.loginRole, false, NOT_ADMIN, '不是管理员用户');
      return R.err('你不是管理员用户。');
    }
  }

  async logOut(): Promise<R> {
    await this.cacheTokenService.deleteToken(this.baseContextService.getUserData().token);
    return R.ok();
  }

  private async getLoginLogsOfPasswordError(userId: string, loginIp: string, loginRole: string) {
    const loginLog = await this.logUserLoginService.selAllLogUserLogin({
      userId: userId,
      ifSuccess: base.N,
      failType: PASSWORD_ERROR,
      loginIp: loginIp,
      loginRole: loginRole,
    }, {
      orderBy: { createTime: 'desc' },
      range: {
        createTime: {
          gte: new Date(timestamp() - 1000 * 60 * 60 * 24),
          lte: new Date(timestamp()),
        },
      },
    });
    return loginLog.data;
  }

  private async insLoginLog(loginIp: string, loginBrowser: string, loginPosition: string, loginOs: string, userId: string, loginRole: string, ifSuccess: boolean, failType: string = '', errorRemark: string = '密码错误') {
    await this.logUserLoginService.insLogUserLogin({
      loginIp: loginIp,
      loginBrowser: loginBrowser,
      loginPosition: loginPosition,
      loginOs: loginOs,
      userId: userId,
      ifSuccess: ifSuccess ? base.Y : base.N,
      failType: failType,
      loginRole: loginRole,
      remark: ifSuccess ? '登录成功' : errorRemark ? errorRemark : '密码错误',
    });
  }
}
