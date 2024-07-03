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
import { DeptModule } from './module/sys-manage/dept/dept.module';
import { CodeGenTableModule } from './module/sys-util/code-gen-table/code-gen-table.module';
import { CodeGenColumnModule } from './module/sys-util/code-gen-column/code-gen-column.module';
import { UserLoginModule as LogUserLoginModule } from './module/sys-monitor/user-login/user-login.module';

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
    DeptModule,
    CodeGenTableModule,
    CodeGenColumnModule,
    LogUserLoginModule,
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
