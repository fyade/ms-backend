import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { loginDto, registDto, resetPsdDto, userDto, userListSelDto } from './dto';
import { genid } from '../../../util/IdUtils';
import { AuthService } from '../auth/auth.service';
import { HTTP } from '../../../common/Enum';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
  }

  async findUserByUsername(username: string): Promise<userDto> {
    const userDto = await this.prisma.findFirst<userDto>('sys_user', { username: username });
    return userDto;
  }

  async regist(dto: registDto): Promise<R> {
    const user = await this.findUserByUsername(dto.username);
    if (user) {
      return R.err('用户名已被使用。');
    }
    const userid = genid(5, false);
    await this.prisma.create<userDto>('sys_user', {
      id: userid,
      username: dto.username,
      password: dto.password,
      create_by: userid,
      update_by: userid,
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
      return R.err('用户不存在。');
    }
  }

  async adminlogin(dto: loginDto): Promise<R> {
    const userinfo = await this.login(dto);
    if (userinfo.code !== HTTP.SUCCESS().code) {
      return R.err(userinfo.msg);
    }
    return R.ok(userinfo.data);
  }

  async userSelList(dto: userListSelDto): Promise<R> {
    const res = await this.prisma.findPage<userDto, userListSelDto>('sys_user', dto);
    res.list = res.list.map(item => ({ ...item, password: null }));
    return R.ok(res);
  }

  async resetPsd(dto: resetPsdDto): Promise<R> {
    const res = await this.prisma.updateById('sys_user', dto);
    return R.ok();
  }
}
