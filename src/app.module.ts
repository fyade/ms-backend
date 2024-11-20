import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { currentEnv } from '../config/config';
import { GlobalExceptionFilter } from './filter/GlobalExceptionFilter';
import { GlobalMiddleware } from './middleware/golbal.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { CacheModule } from './module/cache/cache.module';
import { BaseContextModule } from './module/base-context/base-context.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './module/module/main/sys-manage/user/user.module';
import { FileUploadModule } from './module/module/main/common/file-upload/file-upload.module';
import { SmsModule } from './module/module/main/common/sms/sms.module';
import { MenuModule } from './module/module/main/sys-manage/menu/menu.module';
import { RoleModule } from './module/module/main/sys-manage/role/role.module';
import { UserRoleModule } from './module/module/main/sys-manage/user-role/user-role.module';
import { RolePermissionModule } from './module/module/main/sys-manage/role-permission/role-permission.module';
import { DicTypeModule } from './module/module/main/sys-manage/dic-type/dic-type.module';
import { DicDataModule } from './module/module/main/sys-manage/dic-data/dic-data.module';
import { CodeGenerationModule } from './module/module/main/sys-util/code-generation/code-generation.module';
import { CodeGenTableModule } from './module/module/main/sys-util/code-gen-table/code-gen-table.module';
import { CodeGenColumnModule } from './module/module/main/sys-util/code-gen-column/code-gen-column.module';
import { LogUserLoginModule } from './module/module/main/sys-log/log-user-login/log-user-login.module';
import { DeptModule } from './module/module/main/sys-manage/dept/dept.module';
import { UserGroupModule } from './module/module/algorithm/user-group/user-group.module';
import { UserDeptModule } from './module/module/main/sys-manage/user-dept/user-dept.module';
import { InterfaceGroupModule } from './module/module/algorithm/interface-group/interface-group.module';
import { DeptPermissionModule } from './module/module/main/sys-manage/dept-permission/dept-permission.module';
import { UserUserGroupModule } from './module/module/algorithm/user-user-group/user-user-group.module';
import { InterfaceModule } from './module/module/algorithm/interface/interface.module';
import { InterfaceInterfaceGroupModule } from './module/module/algorithm/interface-interface-group/interface-interface-group.module';
import { UserGroupPermissionModule } from './module/module/algorithm/user-group-permission/user-group-permission.module';
import { LogAlgorithmCallModule } from './module/module/algorithm/log-algorithm-call/log-algorithm-call.module';
import { OnlineUserModule } from './module/module/main/sys-monitor/online-user/online-user.module';
import { LogOperationModule } from './module/module/main/sys-log/log-operation/log-operation.module';
import { AlgorithmModule } from './module/module/algorithm/algorithm/algorithm.module';
import { SysModule } from './module/module/main/sys-manage/sys/sys.module';
import { RoleSysModule } from './module/module/main/sys-manage/role-sys/role-sys.module';
import { DeptSysModule } from './module/module/main/sys-manage/dept-sys/dept-sys.module';
import { MenuIpWhiteListModule } from './module/module/main/sys-manage/menu-ip-white-list/menu-ip-white-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [currentEnv],
    }),
    ServeStaticModule.forRoot({
      rootPath: currentEnv().file.fileUploadPath,
      serveRoot: currentEnv().staticRoot,
    }),
    AuthModule,
    CacheModule,
    BaseContextModule,
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
    UserUserGroupModule,
    InterfaceModule,
    InterfaceInterfaceGroupModule,
    UserGroupPermissionModule,
    LogAlgorithmCallModule,
    OnlineUserModule,
    LogOperationModule,
    AlgorithmModule,
    SysModule,
    RoleSysModule,
    DeptSysModule,
    MenuIpWhiteListModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AppService,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(GlobalMiddleware)
  //     .forRoutes('*');
  // }
}
