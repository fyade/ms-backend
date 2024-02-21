import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from "./user.service";
import { loginDto, registDto } from "./dto";
import { R } from "../../common/R";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('regist')
  async regist(@Body() dto: registDto): Promise<R> {
    return this.userService.regist(dto)
  }

  @Post('login')
  async login(@Body() dto: loginDto): Promise<R> {
    return this.userService.login(dto)
  }
}
