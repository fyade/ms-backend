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

  async hasPermission(userid: string, permission: string) {
    const admintop = await this.prisma.findFirst('sys_admin_top', { user_id: userid });
    return !!admintop;
  }
}
