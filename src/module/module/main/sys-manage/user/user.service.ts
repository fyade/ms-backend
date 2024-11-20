import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { AdminNewUserDto, LoginDto, RegistDto, ResetPsdDto, UpdPsdDto, UserDto, UserListSelDto } from './dto';
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

  async getSelfInfo(): Promise<R> {
    const currentUser = this.baseContextService.getUserData().user;
    const user = await this.prisma.findById<UserDto>('sys_user', currentUser.userid);
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

  async userSelList(dto: UserListSelDto): Promise<R> {
    const ifWithRole = dto.ifWithRole;
    delete dto.ifWithRole;
    const res = await this.prisma.findPage<UserDto, UserListSelDto>('sys_user', {
      data: dto,
      notNullKeys: ['id', 'username'],
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
    }, false);
    const res2 = [];
    const userIds = res.list.map(item => item.id);
    const allUserRolesOfThoseUsers = await this.prisma.findAll<UserRoleDto>('sys_user_role', {
      data: {
        userId: {
          in: userIds,
        },
      },
    }, false);
    const allRoleIdsOfThoseUsers = allUserRolesOfThoseUsers.map(item => item.roleId);
    const allRolesOfThoseUsers = await this.prisma.findAll<RoleDto>('sys_role', {
      data: {
        id: {
          in: allRoleIdsOfThoseUsers,
        },
      },
    }, false);
    const allUserDeptsOfThoseUsers = await this.prisma.findAll<UserDeptDto>('sys_user_dept', {
      data: {
        userId: {
          in: userIds,
        },
      },
    }, false);
    const allUserDeptIdsOfThoseUsers = allUserDeptsOfThoseUsers.map(item => item.deptId);
    const allDeptsOfThoseUsers = await this.prisma.findAll<DeptDto>('sys_dept', {
      data: {
        id: {
          in: allUserDeptIdsOfThoseUsers,
        },
      },
    }, false);
    const allUserUserGroupsOfThoseUsers = await this.prisma.findAll<UserUserGroupDto>('sys_user_user_group', {
      data: {
        userId: {
          in: userIds,
        },
      },
    }, false);
    const allUserUserGroupIdsOfThoseUsers = allUserUserGroupsOfThoseUsers.map(item => item.userGroupId);
    const allUserGroupsOfThoseUsers = await this.prisma.findAll<UserGroupDto>('sys_user_group', {
      data: {
        id: {
          in: allUserUserGroupIdsOfThoseUsers,
        },
      },
    }, false);
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
    const user_ = await this.prisma.findById<UserDto>('sys_user', this.baseContextService.getUserData().user.userid);
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

  async adminResetUserPsd(dto: ResetPsdDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(this.baseContextService.getUserData().user.userid, dto.id)) {
      throw new UserPermissionDeniedException();
    }
    await this.prisma.updateById('sys_user', { ...dto, password: await hashPassword(dto.password) });
    return R.ok();
  }

  async regist(dto: RegistDto): Promise<R> {
    const user = await this.authService.findUserByUsername(dto.username);
    if (user) {
      return R.err('用户名已被使用。');
    }
    const userid = genId(5, false);
    await this.prisma.create<UserDto>('sys_user', {
      id: userid,
      username: dto.username,
      password: await hashPassword(dto.password),
      createBy: userid,
      updateBy: userid,
    }, { ifCustomizeId: true });
    return R.ok('注册成功。');
  }

  async login(dto: LoginDto, { loginIp, loginBrowser, loginOs }): Promise<R> {
    let user: UserDto;
    const user_ = await this.prisma.findFirst<UserDto>('sys_user', {
      username: dto.username,
    });
    if (!user_) {
      throw new UserUnknownException();
    }
    const b1 = await comparePassword(dto.password, user_.password);
    if (b1) {
      user = user_;
    }
    if (user) {
      delete user.password;
      const loginLog = await this.logUserLoginService.selAllLogUserLogin({
        userId: user.id,
        ifSuccess: base.N,
      }, {
        orderBy: { createTime: 'desc' },
        range: {
          createTime: {
            gte: new Date(timestamp() - 1000 * 60 * 60 * 24),
            lte: new Date(timestamp()),
          },
        },
      });
      if (loginLog.data.length >= this.maxLoginFailCount) {
        const sort = loginLog.data.sort((a, b) => timestamp(a.createTime) - timestamp(b.createTime));
        const number = Math.ceil(24 - (timestamp() - timestamp(sort[0].createTime)) / (1000 * 60 * 60));
        return R.err(`密码错误次数过多，请${number}小时后重试。`);
      }
      await this.logUserLoginService.insLogUserLogin({
        loginIp: loginIp,
        loginBrowser: loginBrowser,
        loginPosition: '',
        loginOs: loginOs,
        userId: user.id,
        ifSuccess: base.Y,
        remark: '登录成功',
      }, {
        ifCreateBy: false,
        ifUpdateBy: false,
        ifUpdateTime: false,
        ifDeleted: false,
      });
      const token = await this.cacheTokenService.genToken(user);
      return R.ok({
        token: token,
        user: user,
      });
    }
    const user2 = await this.prisma.findFirst<UserDto>('sys_user', {
      username: dto.username,
    });
    if (user2) {
      await this.logUserLoginService.insLogUserLogin({
        loginIp: loginIp,
        loginBrowser: loginBrowser,
        loginPosition: '',
        loginOs: loginOs,
        userId: user2.id,
        ifSuccess: base.N,
        remark: '密码错误',
      }, {
        ifCreateBy: false,
        ifUpdateBy: false,
        ifUpdateTime: false,
        ifDeleted: false,
      });
      const loginLog = await this.logUserLoginService.selAllLogUserLogin({
        userId: user2.id,
        ifSuccess: base.N,
      }, {
        orderBy: { createTime: 'desc' },
        range: {
          createTime: {
            gte: new Date(timestamp() - 1000 * 60 * 60 * 24),
            lte: new Date(timestamp()),
          },
        },
      });
      if (loginLog.data.length >= this.maxLoginFailCount) {
        const sort = loginLog.data.sort((a, b) => timestamp(a.createTime) - timestamp(b.createTime));
        const number = Math.ceil(24 - (timestamp() - timestamp(sort[0].createTime)) / (1000 * 60 * 60));
        return R.err(`密码错误次数过多，请${number}小时后重试。`);
      }
      return R.err(`密码错误，还剩${this.maxLoginFailCount - loginLog.data.length}次机会。`);
    }
  }

  async adminlogin(dto: LoginDto, { loginIp, loginBrowser, loginOs }): Promise<R> {
    const userinfo = await this.login(dto, { loginIp, loginBrowser, loginOs });
    if (userinfo.code !== HTTP.SUCCESS().code) {
      return R.err(userinfo.msg);
    }
    // const permissions = await this.authService.permissionsOfUser(userinfo.data.user);
    // const systems = await this.authService.systemsOfUser(userinfo.data.user);
    return R.ok({
      ...userinfo.data,
      // permissions,
      // systems,
    });
  }
}
