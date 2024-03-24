import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { loginDto, registDto, userDto } from './dto';
import { genid } from '../../../util/IdUtils';
import { AuthService } from '../auth/auth.service';

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
    await this.prisma.create_<userDto>('sys_user', {
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
}
