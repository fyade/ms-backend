import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './module/sys-manage/user/user.module';
import { GlobalExceptionFilter } from './filter/GlobalExceptionFilter';
import { AuthGuard } from './guard/authGuard';
import { APP_GUARD } from '@nestjs/core';
import { expireTime, jwtConstants } from '../config/authConfig';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { currentEnv } from '../config/config';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileUploadModule } from './module/common/file-upload/file-upload.module';
import { SmsModule } from './module/common/sms/sms.module';
import { MenuModule } from './module/sys-manage/menu/menu.module';
import { AuthService } from './module/sys-manage/auth/auth.service';
import { RoleModule } from './module/sys-manage/role/role.module';
import { UserRoleModule } from './module/sys-manage/user-role/user-role.module';
import { RolePermissionModule } from './module/sys-manage/role-permission/role-permission.module';
import { DicTypeModule } from './module/sys-manage/dic-type/dic-type.module';
import { DicDataModule } from './module/sys-manage/dic-data/dic-data.module';
import { CodeGenerationModule } from './module/sys-util/code-generation/code-generation.module';
import { CodeGenTableModule } from './module/sys-util/code-gen-table/code-gen-table.module';
import { CodeGenColumnModule } from './module/sys-util/code-gen-column/code-gen-column.module';
import { LogUserLoginModule } from './module/sys-monitor/log-user-login/log-user-login.module';
import { DeptModule } from './module/sys-manage/dept/dept.module';
import { UserGroupModule } from './module/sys-manage/user-group/user-group.module';
import { UserDeptModule } from './module/sys-manage/user-dept/user-dept.module';
import { InterfaceGroupModule } from './module/sys-manage/interface-group/interface-group.module';
import { DeptPermissionModule } from './module/sys-manage/dept-permission/dept-permission.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [currentEnv],
    }),
    ServeStaticModule.forRoot({
      rootPath: currentEnv().file.fileUploadPath,
      serveRoot: currentEnv().staticRoot,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: expireTime },
    }),
    PrismaModule,
    RedisModule,
    FileUploadModule,
    SmsModule,
    UserModule,
    MenuModule,
    RoleModule,
    UserRoleModule,
    RolePermissionModule,
    DicTypeModule,
    DicDataModule,
    CodeGenerationModule,
    CodeGenTableModule,
    CodeGenColumnModule,
    LogUserLoginModule,
    DeptModule,
    UserGroupModule,
    UserDeptModule,
    InterfaceGroupModule,
    DeptPermissionModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    GlobalExceptionFilter,
    AppService,
    AuthService,
    JwtService,
  ],
})
export class AppModule {
}
